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


    def segment_text(self, raw_text: str) -> List[Clause_cl]:
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

    def segment_text_with_llm(self, raw_text: str) -> List[Clause_cl]:
        if not raw_text:
            return []

        json_schema = {
            "type": "array",
            "description": "A list of segmented clauses from the contract text.",
            "items": {
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "The full text of the clause."},
                    "clause_id": {"type": "string", "description": "The numerical or textual identifier of the clause (e.g., '1.2', 'Article 3', '(a)')."},
                    "level": {"type": "integer", "description": "The structural depth of the clause (1 for main sections, 2 for subsections, etc.)."},
                    "heading": {"type": "string", "description": "The title or heading of the clause, if present, otherwise null."}
                },
                "required": ["text", "clause_id", "level"]
            }
        }

        prompt_template = f"""
        You are an expert contract segmentation system. Your task is to analyze the provided raw legal text and segment it into discrete contractual clauses.

        **Instructions:**
        1. Parse the document structure (sections, subsections, paragraphs, bullet points).
        2. Identify each distinct clause and its associated identifier and structural level.
        3. Extract the clause text, its ID, its structural level (starting from 1 for main clauses/sections), and its heading (if explicitly present).
        4. Respond ONLY with a single JSON array that strictly conforms to the provided JSON schema. Do not include any other text, explanations, or code fences.
        5. The `start_pos` field will be calculated later; you do not need to include it in your output.

        **JSON Schema:**
        {json.dumps(json_schema, indent=2)}

        **RAW CONTRACT TEXT TO SEGMENT:**
        ---
        {raw_text}
        ---
        """

        messages = [{"role": "user", "content": prompt_template}]

        llm_response_generator = self.agent.run(messages)

        llm_response_text = "".join(list(llm_response_generator))

        if "stub" in llm_response_text.lower():
            print("--- WARNING: Using LLM segmentation stub result. ---")
            mock_clauses_data = [
                {"text": "This is the first mock clause segmented by the LLM system.", "clause_id": "1.0", "level": 1, "heading": "SCOPE"},
                {"text": "The second clause covers liability and indemnity. It is a sub-section.", "clause_id": "1.1", "level": 2, "heading": None}
            ]
        else:
            try:
                mock_clauses_data = json.loads(llm_response_text)
            except json.JSONDecodeError:
                print(f"Error decoding LLM JSON response: {llm_response_text}")
                return []

        clauses = []
        current_pos = 0
        for data in mock_clauses_data:
            text = data['text'].strip()
            start_pos = current_pos
            line_length = len(text) + 1

            if len(text) >= self.min_clause_length:
                clauses.append(Clause_cl(
                    text=text,
                    clause_id=data.get('clause_id', 'LLM_SEG'),
                    level=data.get('level', 0),
                    start_pos=start_pos,
                    heading=data.get('heading', None)
                ))
            current_pos += line_length

        return clauses

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