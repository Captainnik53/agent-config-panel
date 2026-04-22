import json
import os
from io import StringIO

import paramiko

REMOTE_HOST = os.environ.get('REMOTE_SSH_HOST', '182.76.167.99')
REMOTE_USER = os.environ.get('REMOTE_SSH_USER', 'awaazde')
REMOTE_JSON_PATH = os.environ.get(
    'REMOTE_JSON_PATH',
    '/home/awaazde/www/awaazde/backend/awaazde/ivr/freeswitch/cai/agent_metadata.json',
)
# Local dev: path to PEM file.  Railway: set SSH_PEM_CONTENT env var to raw PEM text.
PEM_KEY_PATH = os.environ.get('SSH_PEM_PATH', '/home/nik/dev/production.pem')
PEM_KEY_CONTENT = os.environ.get('SSH_PEM_CONTENT', '')


def _make_client() -> paramiko.SSHClient:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    if PEM_KEY_CONTENT:
        key = paramiko.RSAKey.from_private_key(StringIO(PEM_KEY_CONTENT))
        client.connect(REMOTE_HOST, username=REMOTE_USER, pkey=key, timeout=10)
    else:
        client.connect(REMOTE_HOST, username=REMOTE_USER, key_filename=PEM_KEY_PATH, timeout=10)
    return client


def read_agent_metadata() -> dict:
    client = _make_client()
    try:
        sftp = client.open_sftp()
        with sftp.open(REMOTE_JSON_PATH, 'r') as f:
            return json.load(f)
    finally:
        client.close()


def write_agent_metadata(data: dict) -> None:
    client = _make_client()
    try:
        sftp = client.open_sftp()
        with sftp.open(REMOTE_JSON_PATH, 'w') as f:
            # ensure_ascii=False preserves Hindi/Unicode text
            f.write(json.dumps(data, indent=4, ensure_ascii=False))
    finally:
        client.close()
