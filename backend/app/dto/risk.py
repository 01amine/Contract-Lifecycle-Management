from dataclasses import dataclass, field
from typing import Literal, List, Tuple

ClauseType = Literal[
    "LIABILITY",
    "INDEMNITY",
    "TERMINATION",
    "CONFIDENTIALITY",
    "FORCE_MAJEURE",
    "DEFINITIONS",
    "PAYMENT_TERMS",
    "WARRANTY",
    "GOVERNING_LAW",
    "STANDARD_BOILERPLATE",
    "UNKNOWN"
]

@dataclass
class ClassifiedClause:
    """
    Represents a clause after being processed by the classifier worker.
    """
    clause_id: str
    text: str
    clause_type: ClauseType
    risk_score: float 
    risk_summary: str
    start_pos: int
    level: int
    matched_keywords: List[str]
    confidence_score: float
    context_flags: List[str]
    alternative_types: List[Tuple[ClauseType, float]] = field(default_factory=list)