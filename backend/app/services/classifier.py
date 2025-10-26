import re
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass, field
from functools import lru_cache
from app.dto.risk import ClassifiedClause, ClauseType
from app.services.segmenter import Clause_cl


@dataclass
class ClassificationMetadata:
    matched_keywords: List[str] = field(default_factory=list)
    confidence_score: float = 0.0
    all_type_scores: Dict[ClauseType, float] = field(default_factory=dict)
    context_flags: List[str] = field(default_factory=list)


class ClauseClassifier:
    
    CLASSIFICATION_RULES: Dict[ClauseType, Dict[str, float]] = {
        "LIABILITY": {
            r"liability|damages|consequential|indirect loss|limitation of": 0.8,
            r"unlimited liability": 0.95,
            r"exclude.*liability|liability.*excluded": 0.85,
        },
        "INDEMNITY": {
            r"indemnify|hold harmless|indemnification": 0.75,
            r"defend.*indemnify|indemnify.*defend": 0.8,
        },
        "TERMINATION": {
            r"terminate|termination|notice period|expiration": 0.6,
            r"termination for convenience": 0.8,
            r"immediate termination|terminate immediately": 0.75,
        },
        "CONFIDENTIALITY": {
            r"confidential|non-disclosure|proprietary information": 0.3,
            r"survive termination": 0.4,
            r"confidentiality obligation|confidential information": 0.35,
        },
        "FORCE_MAJEURE": {
            r"force majeure|act of god|unforeseen event": 0.2,
            r"beyond.*control|circumstances beyond": 0.25,
        },
        "GOVERNING_LAW": {
            r"governing law|jurisdiction|arbitration|venue": 0.5,
            r"exclusive jurisdiction|forum selection": 0.6,
        },
        "PAYMENT_TERMS": {
            r"payment|invoice|fee|price|currency": 0.1,
            r"late payment|interest.*overdue": 0.3,
        },
        "INTELLECTUAL_PROPERTY": {
            r"intellectual property|ip rights|patent|trademark|copyright": 0.7,
            r"work for hire|assignment of rights": 0.8,
            r"license|licensing": 0.6,
        },
        "DATA_PRIVACY": {
            r"gdpr|ccpa|personal data|data protection|privacy": 0.8,
            r"data breach|security incident": 0.85,
        },
        "WARRANTIES": {
            r"warrant(y|ies)|represent(ation)?s?|guarantee": 0.6,
            r"as-is|without warranty|no warranties": 0.75,
            r"disclaimer.*warrant": 0.7,
        },
        "NON_COMPETE": {
            r"non-compete|non-competition|restrictive covenant": 0.7,
            r"non-solicitation": 0.65,
        },
        "ASSIGNMENT": {
            r"assignment|transfer|successors": 0.5,
            r"consent.*assign|assign.*consent": 0.6,
        },
        "INSURANCE": {
            r"insurance|coverage|policy limits": 0.6,
            r"maintain insurance|insurance requirement": 0.65,
        },
        "AUDIT_RIGHTS": {
            r"audit|inspect|examination of records": 0.5,
            r"audit rights|right to audit": 0.55,
        },
    }

    def __init__(self):
        self._compiled_patterns: Dict[ClauseType, List[Tuple[re.Pattern, float]]] = {}
        self._compile_patterns()

    def _compile_patterns(self):
        for clause_type, rules in self.CLASSIFICATION_RULES.items():
            self._compiled_patterns[clause_type] = [
                (re.compile(pattern, re.IGNORECASE), risk)
                for pattern, risk in rules.items()
            ]

    @lru_cache(maxsize=1000)
    def _normalize_text(self, text: str) -> str:
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        return ' '.join(text.split())

    def _determine_type_and_risk(self, text: str) -> Tuple[ClauseType, float, ClassificationMetadata]:
        text_normalized = self._normalize_text(text)
        
        type_scores: Dict[ClauseType, float] = {}
        matched_patterns: Dict[ClauseType, List[str]] = {}
        
        for clause_type, pattern_list in self._compiled_patterns.items():
            max_type_score = 0.0
            type_matches = []
            
            for compiled_pattern, base_risk in pattern_list:
                if compiled_pattern.search(text):
                    max_type_score = max(max_type_score, base_risk)
                    match = compiled_pattern.search(text)
                    if match:
                        type_matches.append(match.group(0))
            
            if max_type_score > 0:
                type_scores[clause_type] = max_type_score
                matched_patterns[clause_type] = type_matches
        
        if not type_scores:
            metadata = ClassificationMetadata(
                confidence_score=0.9,
                all_type_scores={"STANDARD_BOILERPLATE": 0.1}
            )
            return "STANDARD_BOILERPLATE", 0.1, metadata
        
        best_type = max(type_scores, key=type_scores.get)
        final_risk = min(1.0, max(type_scores.values()))
        
        confidence = self._calculate_confidence(type_scores, best_type)
        
        metadata = ClassificationMetadata(
            matched_keywords=matched_patterns.get(best_type, []),
            confidence_score=confidence,
            all_type_scores=type_scores
        )
        
        return best_type, final_risk, metadata

    def _calculate_confidence(self, type_scores: Dict[ClauseType, float], best_type: ClauseType) -> float:
        if len(type_scores) == 1:
            return 0.95
        
        scores = sorted(type_scores.values(), reverse=True)
        if len(scores) > 1:
            score_gap = scores[0] - scores[1]
            confidence = 0.5 + (score_gap * 0.5)
            return min(0.99, confidence)
        
        return 0.9

    def _analyze_context(
        self, 
        current: Clause_cl, 
        all_clauses: List[Clause_cl], 
        idx: int
    ) -> List[str]:
        flags = []
        
        if idx > 0:
            prev_text = all_clauses[idx - 1].text.lower()
            if any(keyword in prev_text for keyword in ["liability", "indemnify", "damages"]):
                flags.append("adjacent_high_risk")
        
        if idx < len(all_clauses) - 1:
            next_text = all_clauses[idx + 1].text.lower()
            if any(keyword in next_text for keyword in ["notwithstanding", "except", "provided that"]):
                flags.append("followed_by_exception")
        
        if re.search(r'"[^"]+" (means|shall mean|refers to)', current.text, re.IGNORECASE):
            flags.append("contains_definition")
        
        if re.search(r'(section|clause|article)\s+\d+', current.text, re.IGNORECASE):
            flags.append("contains_cross_reference")
        
        if len(current.text) > 500:
            flags.append("lengthy_clause")
        
        return flags

    def _adjust_risk_for_context(
        self, 
        risk_score: float, 
        context_flags: List[str]
    ) -> float:
        adjusted_risk = risk_score
        
        if "adjacent_high_risk" in context_flags:
            adjusted_risk = min(1.0, adjusted_risk * 1.15)
        
        if "followed_by_exception" in context_flags:
            adjusted_risk = min(1.0, adjusted_risk * 1.1)
        
        if "lengthy_clause" in context_flags:
            adjusted_risk = min(1.0, adjusted_risk * 1.05)
        
        return adjusted_risk

    def _generate_risk_summary(
        self, 
        clause_type: ClauseType, 
        risk_score: float, 
        matched_patterns: List[str],
        confidence: float
    ) -> str:
        
        if clause_type == "LIABILITY":
            if risk_score > 0.9:
                return " CRITICAL: Unlimited liability exposure detected. REQUIRES IMMEDIATE LEGAL REVIEW."
            elif any("consequential" in p.lower() for p in matched_patterns):
                return "HIGH: Broad consequential damages inclusion. Negotiate cap or exclusion."
            elif risk_score > 0.8:
                return "HIGH: Significant liability terms. Review limitation provisions carefully."
        
        elif clause_type == "INDEMNITY":
            if risk_score > 0.75:
                return "HIGH: One-sided indemnification favoring counterparty. Propose mutual indemnity."
            else:
                return "MEDIUM: Indemnification clause requires review for scope and limitations."
        
        elif clause_type == "DATA_PRIVACY":
            if risk_score > 0.8:
                return "HIGH: Data privacy obligations with potential regulatory implications. Verify compliance."
            else:
                return " MEDIUM: Data privacy terms present. Ensure alignment with company policies."
        
        elif clause_type == "WARRANTIES":
            if any("as-is" in p.lower() or "without warranty" in p.lower() for p in matched_patterns):
                return "HIGH: Warranty disclaimer or as-is provision. Assess risk acceptance."
            else:
                return "MEDIUM: Warranty or representation clause. Verify accuracy and limitations."
        
        elif clause_type == "INTELLECTUAL_PROPERTY":
            if risk_score > 0.75:
                return "HIGH: Significant IP rights transfer or assignment. Verify scope and limitations."
            else:
                return "MEDIUM: IP-related terms. Review ownership and licensing provisions."
        
        elif clause_type == "TERMINATION":
            if risk_score > 0.75:
                return " MEDIUM-HIGH: Termination for convenience or broad termination rights. Review implications."
            else:
                return " MEDIUM: Standard termination provisions. Verify notice periods align with policy."
        
        if confidence < 0.7:
            return f" UNCERTAIN: Low confidence classification as {clause_type}. Manual review recommended."
        
        if risk_score > 0.8:
            return f" HIGH: {clause_type} clause contains non-standard or high-risk terms."
        elif risk_score > 0.5:
            return f" MEDIUM: {clause_type} clause requires legal review for standard adherence."
        elif risk_score > 0.2:
            return f" LOW-MEDIUM: {clause_type} clause warrants brief review."
        else:
            return f" LOW: {clause_type} appears to contain standard administrative language."

    def classify_clauses(self, clauses: List[Clause_cl]) -> List[ClassifiedClause]:
        classified_results: List[ClassifiedClause] = []
        
        for idx, clause in enumerate(clauses):
            clause_type, risk_score, metadata = self._determine_type_and_risk(clause.text)
            
            context_flags = self._analyze_context(clause, clauses, idx)
            metadata.context_flags = context_flags
            
            adjusted_risk = self._adjust_risk_for_context(risk_score, context_flags)
            
            risk_summary = self._generate_risk_summary(
                clause_type, 
                adjusted_risk, 
                metadata.matched_keywords,
                metadata.confidence_score
            )
            
            classified_results.append(ClassifiedClause(
                clause_id=clause.clause_id,
                text=clause.text,
                clause_type=clause_type,
                risk_score=adjusted_risk,
                risk_summary=risk_summary,
                level=clause.level,
                matched_keywords=metadata.matched_keywords,
                confidence_score=metadata.confidence_score,
                context_flags=metadata.context_flags,
                alternative_types=[
                    (ct, score) 
                    for ct, score in sorted(
                        metadata.all_type_scores.items(), 
                        key=lambda x: x[1], 
                        reverse=True
                    )[1:3]
                ]
            ))
        
        return classified_results


def classifier_worker(clauses: List[Clause_cl]) -> List[ClassifiedClause]:
    print(f"Starting classifier worker for {len(clauses)} clauses.")
    
    try:
        classifier = ClauseClassifier()
        classified_results = classifier.classify_clauses(clauses)
        
        type_counts = {}
        high_risk_count = 0
        low_confidence_count = 0
        
        for c in classified_results:
            type_counts[c.clause_type] = type_counts.get(c.clause_type, 0) + 1
            if c.risk_score > 0.8:
                high_risk_count += 1
            if c.confidence_score < 0.7:
                low_confidence_count += 1
        
        print(f"Classification breakdown: {type_counts}")
        print(f"High-risk clauses: {high_risk_count}")
        print(f"Low-confidence classifications: {low_confidence_count}")
        
        return classified_results
    
    except Exception as e:
        print(f"CRITICAL CLASSIFIER WORKER FAILURE: {e}")
        return []