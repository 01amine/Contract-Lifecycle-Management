import re
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class Clause_cl:
    """Represents a single contract clause with metadata."""
    text: str
    clause_id: str  
    level: int  
    start_pos: int  
    heading: Optional[str] = None  


class ClauseSegmenter:
    """
    Analyzes raw text and splits it into discrete contractual clauses.
    Handles multiple numbering schemes and structural patterns.
    """

    def __init__(self, min_clause_length: int = 20, max_clause_length: int = 5000):
        """
        Args:
            min_clause_length: Minimum characters for a valid clause
            max_clause_length: Maximum characters before considering sub-splitting
        """
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

    def segment_text(self, raw_text: str) -> List[Clause_cl]:
        """
        Splits the raw document text into clauses with metadata.

        Args:
            raw_text: The full text of the contract.

        Returns:
            A list of Clause objects with extracted metadata.
        """
        if not raw_text:
            return []

        lines = raw_text.split('\n')
        clauses = []
        current_clause_lines = []
        current_id = "preamble"
        current_level = 0
        current_heading = None
        start_pos = 0
        current_pos = 0

        for line in lines:
            line_length = len(line) + 1  
            matched = False
            
            
            for pattern, level in self.compiled_patterns:
                match = pattern.match(line)
                if match:
                    
                    if current_clause_lines:
                        clause_text = '\n'.join(current_clause_lines).strip()
                        if len(clause_text) >= self.min_clause_length:
                            clauses.append(Clause_cl(
                                text=clause_text,
                                clause_id=current_id,
                                level=current_level,
                                start_pos=start_pos,
                                heading=current_heading
                            ))
                    
                    
                    current_id = match.group(1).strip()
                    current_level = level
                    current_heading = match.group(2).strip() if match.lastindex >= 2 else None
                    current_clause_lines = [line]
                    start_pos = current_pos
                    matched = True
                    break
            
            if not matched:
                current_clause_lines.append(line)
            
            current_pos += line_length

        
        if current_clause_lines:
            clause_text = '\n'.join(current_clause_lines).strip()
            if len(clause_text) >= self.min_clause_length:
                clauses.append(Clause_cl(
                    text=clause_text,
                    clause_id=current_id,
                    level=current_level,
                    start_pos=start_pos,
                    heading=current_heading
                ))

        
        clauses = self._split_long_clauses(clauses)
        
        
        clauses = self._merge_short_fragments(clauses)

        return clauses

    def _split_long_clauses(self, clauses: List[Clause_cl]) -> List[Clause_cl]:
        """Split clauses that exceed max_clause_length by paragraph."""
        result = []
        for clause in clauses:
            if len(clause.text) <= self.max_clause_length:
                result.append(clause)
            else:
                
                paragraphs = re.split(r'\n\s*\n', clause.text)
                for i, para in enumerate(paragraphs):
                    if para.strip():
                        result.append(Clause_cl(
                            text=para.strip(),
                            clause_id=f"{clause.clause_id}.{i+1}",
                            level=clause.level + 1,
                            start_pos=clause.start_pos,
                            heading=clause.heading if i == 0 else None
                        ))
        return result

    def _merge_short_fragments(self, clauses: List[Clause_cl]) -> List[Clause_cl]:
        """Merge very short clauses with the previous clause."""
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
        """Generate statistics about segmented clauses."""
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
        """
        Backward-compatible method that returns just the text strings.
        
        Args:
            raw_text: The full text of the contract.
            
        Returns:
            A list of clause text strings.
        """
        clauses = self.segment_text(raw_text)
        return [clause.text for clause in clauses]