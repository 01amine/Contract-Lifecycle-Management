import re
from typing import List, Dict, Optional
from app.services.agent import agent as abstract_worker_agent
import json

class Clause_cl:
    def __init__(self, text: str, clause_id: str, level: int, start_pos: int, heading: Optional[str] = None):
        self.text = text
        self.clause_id = clause_id
        self.level = level
        self.start_pos = start_pos
        self.heading = heading

    def to_dict(self) -> Dict:
        return {
            "text": self.text,
            "clause_id": self.clause_id,
            "level": self.level,
            "start_pos": self.start_pos,
            "heading": self.heading
        }


class ClauseSegmenter:
    def __init__(self, min_clause_length: int = 20, max_clause_length: int = 5000):
        self.min_clause_length = min_clause_length
        self.max_clause_length = max_clause_length

        self.patterns = [
            (r'^\s*(\d+(?:\.\d+)*\.)\s+(.+?)$', 1),
            (r'^\s*((?:Article|Section|Clause)\s+\d+(?:\.\d+)*)[:\.\s]+(.+?)$', 1),
            (r'^\s*(\([a-z]{1,3}\)|\([ivxlcdm]+\))\s+(.+?)$', 2),
            (r'^\s*([A-Z][A-Z\s]{3,}(?:\d+)?)\s*[-:]?\s*$', 1),
        ]

        self.compiled_patterns = [
            (re.compile(pattern, re.IGNORECASE | re.MULTILINE), level)
            for pattern, level in self.patterns
        ]
        self.agent = abstract_worker_agent


    def segment_text(self, raw_text: str):
        pass

    def _split_long_clauses(self, clauses: List[Clause_cl]) -> List[Clause_cl]:
        result = []
        for clause in clauses:
            if len(clause.text) <= self.max_clause_length:
                result.append(clause)
            else:
                paragraphs = re.split(r'\n\s*\n', clause.text)
                current_pos = clause.start_pos
                for i, para in enumerate(paragraphs):
                    if para.strip():
                        para_text = para.strip()
                        result.append(Clause_cl(
                            text=para_text,
                            clause_id=f"{clause.clause_id}.{i+1}",
                            level=clause.level + 1,
                            start_pos=current_pos,
                            heading=clause.heading if i == 0 else None
                        ))
                        current_pos += len(para_text) + (len(para) - len(para.strip()))
        return result

    def _merge_short_fragments(self, clauses: List[Clause_cl]) -> List[Clause_cl]:
        if not clauses:
            return []


        result = [clauses[0]]
        for clause in clauses[1:]:
            if len(clause.text) < self.min_clause_length and result:


                prev = result[-1]
                result[-1] = Clause_cl(
                    text=f"{prev.text}\n{clause.text}",
                    clause_id=prev.clause_id,
                    level=prev.level,
                    start_pos=prev.start_pos,
                    heading=prev.heading
                )
            else:
                result.append(clause)
        return result

    def get_clause_statistics(self, clauses: List[Clause_cl]) -> Dict:
        if not clauses:
            return {}


        return {
            "total_clauses": len(clauses),
            "avg_length": sum(len(c.text) for c in clauses) / len(clauses),
            "max_length": max(len(c.text) for c in clauses),
            "min_length": min(len(c.text) for c in clauses),
            "levels": {
                level: len([c for c in clauses if c.level == level])
                for level in set(c.level for c in clauses)
            },
            "has_headings": sum(1 for c in clauses if c.heading)
        }

    def segment_text_simple(self, raw_text: str) -> List[str]:
        clauses = self.segment_text(raw_text)
        return [clause.text for clause in clauses]