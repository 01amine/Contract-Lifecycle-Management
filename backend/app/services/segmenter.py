import re
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
from app.services.llm_client import LLMClient
from app.dto.llm_clause import LLMClauseListDTO 

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
    Analyzes raw text and splits it into discrete contractual clauses
    using a Large Language Model..
    """

    def __init__(self, min_clause_length: int = 20, max_clause_length: int = 5000):
        """
        Args:
            min_clause_length: Minimum characters for a valid clause
            max_clause_length: Maximum characters before considering sub-splitting
        """
        self.min_clause_length = min_clause_length
        self.max_clause_length = max_clause_length
        self.llm_client = LLMClient()


    async def segment_text(self, raw_text: str) -> List[Clause_cl]:
        """
        Splits the raw document text into clauses with metadata using the LLM.
        NOTE: This method is now asynchronous to match the LLMClient.

        Args:
            raw_text: The full text of the contract.

        Returns:
            A list of Clause objects with extracted metadata.
        """
        if not raw_text:
            return []

        try:
            # 1. Use LLM to get structured segmentation (now an async call)
            clause_list_pydantic: LLMClauseListDTO = await self.llm_client.segment_document_structured(raw_text)

            # 2. Map the structured Pydantic output back to the existing dataclass
            # and calculate the start_pos based on the raw text.
            clauses = []
            current_pos = 0 # Track position to find clauses in order

            for llm_clause in clause_list_pydantic.clauses:
                # Find the starting position of the clause text in the raw document.
                start_index = raw_text.find(llm_clause.text.strip(), current_pos)

                if start_index != -1:
                    clauses.append(Clause_cl(
                        text=llm_clause.text.strip(),
                        clause_id=llm_clause.clause_id,
                        level=llm_clause.level,
                        start_pos=start_index,
                        heading=llm_clause.heading
                    ))
                    # Update current_pos to search for the next clause starting after the current one ends
                    current_pos = start_index + len(llm_clause.text.strip())
                else:
                    print(f"Warning: Could not find clause text in document for ID: {llm_clause.clause_id}. Appending without accurate start_pos.")
                    clauses.append(Clause_cl(
                        text=llm_clause.text.strip(),
                        clause_id=llm_clause.clause_id,
                        level=llm_clause.level,
                        start_pos=-1,
                        heading=llm_clause.heading
                    ))

            # 3. Apply post-processing (e.g., merging short fragments)
            clauses = self._split_long_clauses(clauses)
            clauses = self._merge_short_fragments(clauses)

            return clauses

        except Exception as e:
            print(f"Error during LLM-based segmentation: {e}")
            # Fallback to simple segmentation if LLM fails
            return self._fallback_segmentation(raw_text)

    # --- Helper methods remain the same, ensure segment_text_simple is updated ---

    def _fallback_segmentation(self, raw_text: str) -> List[Clause_cl]:
        """A simple paragraph-based fallback in case the LLM call fails."""
        print("Executing fallback segmentation.")
        paragraphs = re.split(r'\n\s*\n', raw_text)
        clauses = []
        start_pos_tracker = 0
        for i, para in enumerate(paragraphs):
            text = para.strip()
            if len(text) >= self.min_clause_length:
                 clauses.append(Clause_cl(
                    text=text,
                    clause_id=f"Fallback_{i+1}",
                    level=1,
                    start_pos=raw_text.find(text, start_pos_tracker),
                    heading=None
                ))
            start_pos_tracker += len(para) + 2

        clauses = self._split_long_clauses(clauses)
        clauses = self._merge_short_fragments(clauses)
        return clauses


    def _split_long_clauses(self, clauses: List[Clause_cl]) -> List[Clause_cl]:
        """Split clauses that exceed max_clause_length by paragraph (Helper)."""
        result = []
        for clause in clauses:
            if len(clause.text) <= self.max_clause_length:
                result.append(clause)
            else:
                paragraphs = re.split(r'\n\s*\n', clause.text)
                current_start_offset = 0
                for i, para in enumerate(paragraphs):
                    if para.strip():
                        # Calculate accurate start_pos for sub-clauses
                        sub_text = para.strip()
                        start_offset = clause.text.find(sub_text, current_start_offset)
                        current_start_offset = start_offset + len(sub_text)

                        result.append(Clause_cl(
                            text=sub_text,
                            clause_id=f"{clause.clause_id}.{i+1}",
                            level=clause.level + 1,
                            start_pos=clause.start_pos + start_offset if start_offset != -1 else clause.start_pos,
                            heading=clause.heading if i == 0 else None
                        ))
        return result

    def _merge_short_fragments(self, clauses: List[Clause_cl]) -> List[Clause_cl]:
        """Merge very short clauses with the previous clause (Helper)."""
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
        """Generate statistics about segmented clauses (Unchanged)."""
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

    async def segment_text_simple(self, raw_text: str) -> List[str]:
        """Backward-compatible method that returns just the text strings (Updated to be async)."""
        clauses = await self.segment_text(raw_text)
        return [clause.text for clause in clauses]