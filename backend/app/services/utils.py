# # from src.agents import AGENT_RESPONSE_KEYS
from agno.agent import Agent


# def extract_response_from_agent(response, agent_name):
# 	"""
# 	Extracts relevant fields from the assistant's message based on the agent's predefined keys.

# 	Args:
# 	    response: The response object returned by the agent.
# 	    agent_name (str): The name of the agent, used to determine expected keys.

# 	Returns:
# 	    dict: A dictionary containing the extracted key-value pairs, or None if no valid response.
# 	"""
# 	# Get expected keys for the agent, default to an empty list if not found

# 	# expected_keys = AGENT_RESPONSE_KEYS.get(agent_name, [])
# 	answer = response.content
# 	if isinstance(answer, str):
# 		answer = {expected_keys[0]: answer}
# 		return answer
# 	else:
# 		answer = answer.dict()
# 		answer = {key: answer.get(key) for key in expected_keys}
# 		return answer
	
# def getAgentAnswer(agent: Agent, query: str, structured_outputs: bool = True, stream: bool = False) -> str:
#     result = agent.run(query, structured_outputs=structured_outputs, stream=stream)
#     return result.content

def create_agent(**kwargs) -> Agent:
    agent = Agent(
        **kwargs
    )
    return agent