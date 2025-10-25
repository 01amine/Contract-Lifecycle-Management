import re
from typing import List, Optional, Tuple, Callable, Awaitable
from dataclasses import dataclass, field


@dataclass
class LLMSuggestion:
    """Represents a single suggestion or advice item."""
    suggestion_type: str  # 'RiskMitigation', 'DraftingChange', 'ComplianceNote', 'MissingClause'
    detail: str
    priority: str  # 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    target_text: Optional[str] = None
    recommended_text: Optional[str] = None


@dataclass
class LLMVerdict:
    """The final, enhanced output for a single clause."""
    clause_id: str
    llm_analysis: str
    llm_verdict_score: float  # 0.0 to 1.0
    suggestions: List[LLMSuggestion] = field(default_factory=list)
    comparison_summary: str = ""
    non_standard_terms: List[str] = field(default_factory=list)
    compliance_issues: List[str] = field(default_factory=list)
    missing_elements: List[str] = field(default_factory=list)
    matched_template_id: Optional[str] = None
    deviation_score: float = 0.0


@dataclass
class ClassifiedClause:
    """Input clause data structure."""
    clause_id: str
    text: str
    clause_type: str
    confidence_score: float
    risk_score: float
    risk_summary: str
    context_flags: List[str] = field(default_factory=list)
    matched_keywords: List[str] = field(default_factory=list)


@dataclass
class ClauseResponse:
    """Template clause from retrieval system."""
    template_id: str
    policy_type: str
    country: str
    version: str
    title: str
    text: str
    score: float


@dataclass
class LLMConfig:
    """Configuration for LLM generation."""
    temperature: float = 0.3
    max_output_tokens: int = 2048
    top_p: float = 0.95
    top_k: int = 40


class LLMWorker:
    """
    Enhanced LLM worker with comprehensive RAG-based risk and compliance analysis.
    All external dependencies are passed as parameters.
    """
    
    def __init__(
        self,
        standard_requirements: Optional[dict] = None
    ):
        """
        Initialize LLM worker.
        
        Args:
            standard_requirements: Dict mapping clause types to required elements
        """
        self.standard_requirements = standard_requirements or {
            "LIABILITY": ["limitation amount", "exclusion list", "mutual protection"],
            "INDEMNITY": ["scope definition", "defense obligation", "notice requirement"],
            "TERMINATION": ["notice period", "cure period", "termination consequences"],
            "CONFIDENTIALITY": ["definition of confidential info", "exclusions", "duration"],
            "FORCE_MAJEURE": ["qualifying events", "notification requirement", "suspension terms"],
            "INTELLECTUAL_PROPERTY": ["ownership rights", "license scope", "restrictions"],
            "DATA_PRIVACY": ["GDPR compliance", "data processing terms", "breach notification"],
            "WARRANTIES": ["scope of warranty", "disclaimer", "remedy"],
        }

    def _format_context(self, retrieved_clauses: List[ClauseResponse]) -> str:
        """Formats retrieved template clauses with relevance scores."""
        if not retrieved_clauses:
            return "No similar clauses retrieved from the template database."
            
        context_parts = []
        for i, rc in enumerate(retrieved_clauses):
            context_parts.append(
                f"--- Template Clause {i+1} (Relevance: {float(rc.score):.2%}) ---\n"
                f"Template ID: {rc.template_id}\n"
                f"Policy Type: {rc.policy_type}\n"
                f"Country: {rc.country}\n"
                f"Version: {rc.version}\n"
                f"Title: {rc.title}\n"
                f"Standard Text:\n{rc.text}\n"
            )
        return "\n\n".join(context_parts)

    def _build_enhanced_prompt(
        self, 
        clause: ClassifiedClause, 
        context_str: str,
        all_clause_types: List[str]
    ) -> str:
        """Constructs a comprehensive prompt for risk and compliance analysis."""
        
        standard_reqs = self.standard_requirements.get(clause.clause_type, [])
        
        prompt = f"""You are an expert legal contract analyst specializing in risk assessment and compliance review.

**YOUR MISSION**: Analyze the CURRENT CLAUSE for:
1. **Non-Standard Terms**: Any unusual, one-sided, or problematic language
2. **High-Risk Exposure**: Legal, financial, or operational risks
3. **Compliance Issues**: Regulatory concerns (GDPR, industry standards, local laws)
4. **Missing Elements**: What standard provisions are absent
5. **Template Deviation**: How it differs from best practice templates

## CURRENT CLAUSE UNDER REVIEW

**Clause ID**: {clause.clause_id}
**Classified Type**: {clause.clause_type} (Confidence: {clause.confidence_score:.1%})
**Initial Risk Score**: {clause.risk_score:.2f}/1.0
**Automated Risk Summary**: {clause.risk_summary}
**Context Flags**: {', '.join(clause.context_flags) if clause.context_flags else 'None'}
**Matched Keywords**: {', '.join(clause.matched_keywords) if clause.matched_keywords else 'None'}

**Full Clause Text**:
```
{clause.text}
```

## RETRIEVED TEMPLATE CLAUSES (RAG Context)

{context_str}

## STANDARD REQUIREMENTS FOR {clause.clause_type} CLAUSES

A well-drafted {clause.clause_type} clause should typically include:
{chr(10).join(f'- {req}' for req in standard_reqs) if standard_reqs else '- No specific requirements defined'}

## OTHER CLAUSE TYPES PRESENT IN THIS CONTRACT

{', '.join(all_clause_types)}
(Consider inter-clause dependencies and overall contract balance)

## REQUIRED OUTPUT FORMAT

You must provide a structured response using these exact XML-style tags:

### 1. <ANALYSIS>...</ANALYSIS>
Provide 4-6 sentences covering:
- Key risk factors in the current clause
- How it compares to the retrieved templates
- Any unusual or concerning language
- Compliance considerations (GDPR, local law, industry standards)

### 2. <VERDICT_SCORE>X.XX</VERDICT_SCORE>
A single float between 0.00 and 1.00 representing overall risk:
- 0.00-0.20: Low risk, standard language
- 0.21-0.50: Medium risk, minor concerns
- 0.51-0.80: High risk, significant issues
- 0.81-1.00: Critical risk, requires immediate attention

### 3. <NON_STANDARD_TERMS>
<TERM>specific problematic phrase or term</TERM>
<TERM>another unusual provision</TERM>
</NON_STANDARD_TERMS>

### 4. <COMPLIANCE_ISSUES>
<ISSUE>Specific regulatory or legal concern</ISSUE>
</COMPLIANCE_ISSUES>

### 5. <MISSING_ELEMENTS>
<ELEMENT>Standard provision that should be present</ELEMENT>
</MISSING_ELEMENTS>

### 6. <DEVIATION_SCORE>X.XX</DEVIATION_SCORE>
How much this deviates from the best-matching template (0.00 = identical, 1.00 = completely different)

### 7. <COMPARISON>...</COMPARISON>
2-3 sentences comparing to the most relevant template. Be specific about differences.

### 8. <MATCHED_TEMPLATE>template_id</MATCHED_TEMPLATE>
The template ID that is most similar to this clause.

### 9. <SUGGESTIONS>
<SUGGESTION type="[type]" priority="[priority]">
<DETAIL>Specific actionable recommendation</DETAIL>
<RECOMMENDED_TEXT>Optional: Suggested replacement language</RECOMMENDED_TEXT>
</SUGGESTION>
</SUGGESTIONS>

**Valid suggestion types**: RiskMitigation, DraftingChange, ComplianceNote, MissingClause
**Valid priorities**: CRITICAL, HIGH, MEDIUM, LOW

## EXAMPLES OF GOOD SUGGESTIONS

<SUGGESTION type="DraftingChange" priority="HIGH">
<DETAIL>Replace "unlimited liability" with a mutual cap tied to contract value. Current language creates asymmetric risk exposure.</DETAIL>
<RECOMMENDED_TEXT>Each party's liability shall be limited to the total fees paid under this Agreement in the 12 months preceding the claim, except for breaches of confidentiality, IP infringement, or gross negligence.</RECOMMENDED_TEXT>
</SUGGESTION>

<SUGGESTION type="ComplianceNote" priority="CRITICAL">
<DETAIL>Clause lacks GDPR-required data processing terms. EU data transfers require explicit legal basis and controller/processor definitions per Articles 28 and 44.</DETAIL>
</SUGGESTION>

<SUGGESTION type="MissingClause" priority="MEDIUM">
<DETAIL>No force majeure provision detected in the contract. Add standard force majeure clause to protect against unforeseeable circumstances.</DETAIL>
</SUGGESTION>

Now analyze the CURRENT CLAUSE and provide your structured response."""

        return prompt

    def _parse_llm_response(self, raw_text: str) -> Tuple[
        str, float, List[LLMSuggestion], str, List[str], List[str], 
        List[str], Optional[str], float
    ]:
        """Parses the structured XML-style output from the LLM."""
        
        # Default values
        analysis = ""
        verdict_score = 0.5
        suggestions = []
        comparison = ""
        non_standard_terms = []
        compliance_issues = []
        missing_elements = []
        matched_template = None
        deviation_score = 0.5

        # Parse analysis
        analysis_match = re.search(r"<ANALYSIS>(.*?)</ANALYSIS>", raw_text, re.DOTALL)
        if analysis_match:
            analysis = analysis_match.group(1).strip()
            
        # Parse verdict score
        score_match = re.search(r"<VERDICT_SCORE>([\d.]+)</VERDICT_SCORE>", raw_text)
        if score_match:
            try:
                verdict_score = max(0.0, min(1.0, float(score_match.group(1).strip())))
            except ValueError:
                pass
        
        # Parse non-standard terms
        terms_block = re.search(r"<NON_STANDARD_TERMS>(.*?)</NON_STANDARD_TERMS>", raw_text, re.DOTALL)
        if terms_block:
            non_standard_terms = [
                m.group(1).strip() 
                for m in re.finditer(r"<TERM>(.*?)</TERM>", terms_block.group(1), re.DOTALL)
            ]
        
        # Parse compliance issues
        issues_block = re.search(r"<COMPLIANCE_ISSUES>(.*?)</COMPLIANCE_ISSUES>", raw_text, re.DOTALL)
        if issues_block:
            compliance_issues = [
                m.group(1).strip() 
                for m in re.finditer(r"<ISSUE>(.*?)</ISSUE>", issues_block.group(1), re.DOTALL)
            ]
        
        # Parse missing elements
        missing_block = re.search(r"<MISSING_ELEMENTS>(.*?)</MISSING_ELEMENTS>", raw_text, re.DOTALL)
        if missing_block:
            missing_elements = [
                m.group(1).strip() 
                for m in re.finditer(r"<ELEMENT>(.*?)</ELEMENT>", missing_block.group(1), re.DOTALL)
            ]
        
        # Parse deviation score
        dev_match = re.search(r"<DEVIATION_SCORE>([\d.]+)</DEVIATION_SCORE>", raw_text)
        if dev_match:
            try:
                deviation_score = max(0.0, min(1.0, float(dev_match.group(1).strip())))
            except ValueError:
                pass
        
        # Parse comparison
        comparison_match = re.search(r"<COMPARISON>(.*?)</COMPARISON>", raw_text, re.DOTALL)
        if comparison_match:
            comparison = comparison_match.group(1).strip()
        
        # Parse matched template
        template_match = re.search(r"<MATCHED_TEMPLATE>(.*?)</MATCHED_TEMPLATE>", raw_text, re.DOTALL)
        if template_match:
            matched_template = template_match.group(1).strip()
        
        # Parse suggestions
        suggestions_block = re.search(r"<SUGGESTIONS>(.*?)</SUGGESTIONS>", raw_text, re.DOTALL)
        if suggestions_block:
            for sugg_match in re.finditer(
                r'<SUGGESTION\s+type=["\']([^"\']+)["\']\s+priority=["\']([^"\']+)["\']>(.*?)</SUGGESTION>',
                suggestions_block.group(1),
                re.DOTALL
            ):
                sugg_type = sugg_match.group(1).strip()
                priority = sugg_match.group(2).strip()
                content = sugg_match.group(3).strip()
                
                detail_match = re.search(r"<DETAIL>(.*?)</DETAIL>", content, re.DOTALL)
                detail = detail_match.group(1).strip() if detail_match else content
                
                recommended_match = re.search(r"<RECOMMENDED_TEXT>(.*?)</RECOMMENDED_TEXT>", content, re.DOTALL)
                recommended = recommended_match.group(1).strip() if recommended_match else None
                
                suggestions.append(LLMSuggestion(
                    suggestion_type=sugg_type,
                    priority=priority,
                    detail=detail,
                    recommended_text=recommended
                ))

        return (
            analysis, verdict_score, suggestions, comparison,
            non_standard_terms, compliance_issues, missing_elements,
            matched_template, deviation_score
        )

    async def analyze_clause(
        self, 
        clause: ClassifiedClause, 
        retrieved_clauses: List[ClauseResponse],
        all_clause_types: List[str],
        llm_generate_fn: Callable[[str, LLMConfig], Awaitable[str]],
        llm_config: LLMConfig
    ) -> LLMVerdict:
        """
        Performs comprehensive RAG-based analysis of a single clause.
        
        Args:
            clause: The classified clause to analyze
            retrieved_clauses: Similar template clauses from RAG retrieval
            all_clause_types: List of all clause types in the contract
            llm_generate_fn: Async function that takes (prompt, config) and returns LLM response text
            llm_config: Configuration for LLM generation
            
        Returns:
            LLMVerdict with comprehensive analysis
        """
        
        context_str = self._format_context(retrieved_clauses)
        prompt = self._build_enhanced_prompt(clause, context_str, all_clause_types)
        
        try:
            response_text = await llm_generate_fn(prompt, llm_config)
            
            (
                analysis, score, suggestions, comparison,
                non_standard_terms, compliance_issues, missing_elements,
                matched_template, deviation_score
            ) = self._parse_llm_response(response_text)
            
            return LLMVerdict(
                clause_id=clause.clause_id,
                llm_analysis=analysis,
                llm_verdict_score=score,
                suggestions=suggestions,
                comparison_summary=comparison,
                non_standard_terms=non_standard_terms,
                compliance_issues=compliance_issues,
                missing_elements=missing_elements,
                matched_template_id=matched_template,
                deviation_score=deviation_score
            )

        except Exception as e:
            print(f"[ERROR] LLM API failed for clause {clause.clause_id}: {e}")
            return LLMVerdict(
                clause_id=clause.clause_id,
                llm_analysis=f"LLM analysis failed: {str(e)}. Manual review required.",
                llm_verdict_score=clause.risk_score,
                suggestions=[LLMSuggestion(
                    suggestion_type="Error",
                    priority="HIGH",
                    detail="LLM analysis unavailable. Conduct manual legal review."
                )],
                comparison_summary="N/A - Analysis failed",
                deviation_score=1.0
            )


async def llm_worker(
    classified_clauses: List[ClassifiedClause],
    retrieval_fn: Callable[[str, int], Awaitable[List[ClauseResponse]]],
    llm_generate_fn: Callable[[str, LLMConfig], Awaitable[str]],
    llm_config: LLMConfig,
    standard_requirements: Optional[dict] = None,
    top_k_retrieval: int = 3,
    verbose: bool = True
) -> List[LLMVerdict]:
    """
    Main worker function for LLM-based risk and compliance analysis.
    
    Args:
        classified_clauses: List of clauses from classifier
        retrieval_fn: Async function that takes (document_text, top_k) and returns similar clauses
        llm_generate_fn: Async function that takes (prompt, config) and returns LLM response text
        llm_config: Configuration for LLM generation
        standard_requirements: Optional dict of standard requirements by clause type
        top_k_retrieval: Number of similar templates to retrieve for RAG context
        verbose: Whether to print progress logs
        
    Returns:
        List of LLMVerdict objects with comprehensive analysis
        
    Example usage:
        ```python
        # Define your LLM generation function
        async def my_llm_generate(prompt: str, config: LLMConfig) -> str:
            # Call your LLM API here
            response = await gemini_client.generate(prompt, temperature=config.temperature)
            return response.text
        
        # Define your retrieval function
        async def my_retrieval(text: str, top_k: int) -> List[ClauseResponse]:
            # Call your vector DB here
            results = await vector_db.search(text, limit=top_k)
            return results
        
        # Run analysis
        verdicts = await llm_worker(
            classified_clauses=clauses,
            retrieval_fn=my_retrieval,
            llm_generate_fn=my_llm_generate,
            llm_config=LLMConfig(temperature=0.3, max_output_tokens=2048)
        )
        ```
    """
    if verbose:
        print(f"[LLM WORKER] Starting analysis for {len(classified_clauses)} clauses...")
    
    try:
        llm_service = LLMWorker(standard_requirements=standard_requirements)
        
        # Extract all clause types for context
        all_clause_types = list(set(c.clause_type for c in classified_clauses))
        
        results: List[LLMVerdict] = []
        
        for idx, clause in enumerate(classified_clauses):
            if verbose:
                print(f"[LLM WORKER] Processing clause {idx+1}/{len(classified_clauses)}: {clause.clause_id}")
            
            # RAG: Retrieve similar template clauses
            try:
                retrieved_clauses = await retrieval_fn(clause.text, top_k_retrieval)
                if verbose:
                    print(f"[LLM WORKER] Retrieved {len(retrieved_clauses)} similar templates")
            except Exception as e:
                if verbose:
                    print(f"[WARNING] Template retrieval failed for {clause.clause_id}: {e}")
                retrieved_clauses = []
            
            # LLM Analysis
            verdict = await llm_service.analyze_clause(
                clause, 
                retrieved_clauses, 
                all_clause_types,
                llm_generate_fn,
                llm_config
            )
            results.append(verdict)
            
            # Log high-risk findings
            if verbose and verdict.llm_verdict_score > 0.7:
                print(f"[ALERT] High-risk clause detected: {clause.clause_id} (Score: {verdict.llm_verdict_score:.2f})")
        
        # Summary statistics
        if verbose:
            high_risk_count = sum(1 for v in results if v.llm_verdict_score > 0.7)
            critical_suggestions = sum(
                1 for v in results 
                for s in v.suggestions 
                if s.priority == "CRITICAL"
            )
            
            print(f"[LLM WORKER] Analysis complete:")
            print(f"  - High-risk clauses: {high_risk_count}")
            print(f"  - Critical suggestions: {critical_suggestions}")
            print(f"  - Total compliance issues: {sum(len(v.compliance_issues) for v in results)}")
        
        return results
    
    except Exception as e:
        if verbose:
            print(f"[CRITICAL] LLM worker failure: {e}")
            import traceback
            traceback.print_exc()
        return []