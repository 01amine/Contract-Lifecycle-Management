# app/blockchain/consumer.py
from kafka import KafkaConsumer
import json
from hfc.fabric import Client as FabricClient

# Hyperledger client setup
fabric_client = FabricClient(net_profile="network.json")
fabric_client.new_channel('mychannel')

consumer = KafkaConsumer(
    'contract.finalized',
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda v: json.loads(v)
)

def register_contract_on_blockchain(contract_data):
    # Simplified chaincode call
    contract_hash = contract_data["file_id"]  # or hash of content
    response = fabric_client.chaincode_invoke(
        requestor='Admin',
        channel_name='mychannel',
        peers=['peer0.org1.example.com'],
        args=[contract_hash],
        cc_name='contract_cc',
        fcn='registerContract',
        wait_for_event=True
    )
    print("Contract registered on blockchain:", response)

# Consume events
for message in consumer:
    register_contract_on_blockchain(message.value)
