"""
Converts between the raw agent_metadata.json format and the flat API format
that the frontend consumes.
"""
import copy

# ── Provider path mappings ────────────────────────────────────────────────────

STT_PATHS = {
    'Deepgram':   '/common/integrations/providers/deepgram/speech_to_text_socket.lua',
    'Navana':     '/common/integrations/providers/navana/speech_to_text_socket1.lua',
    'Google STT': '/common/integrations/providers/google/stt/speech_to_text.lua',
    'Azure STT':  '/common/integrations/providers/azure/speech_to_text.lua',
    'Sarvam':     '/common/integrations/providers/sarvam/speech_to_text.lua',
}
DEEPGRAM_BARGE_PATH    = '/common/integrations/providers/deepgram/speech_to_text_socket_barge.lua'
DEEPGRAM_EXTERNAL_PATH = '/common/integrations/providers/deepgram/external_stt.lua'

TTS_PATHS = {
    'ElevenLabs': '/common/integrations/providers/elevenlabs/text_to_speech_socket.lua',
    'Google TTS': '/common/integrations/providers/google/tts/text_to_speech_socket.lua',
    'Azure TTS':  '/common/integrations/providers/azure/tts/text_to_speech.lua',
    'Murf':       '/common/integrations/providers/murf/text_to_speech.lua',
    'Sarvam':     '/common/integrations/providers/sarvam/tts/text_to_speech.lua',
    'Cartesia':   '/common/integrations/providers/cartesia/text_to_speech_socket.lua',
}


def _path_to_stt(path: str) -> str:
    p = (path or '').lower()
    if 'deepgram' in p: return 'Deepgram'
    if 'navana'   in p: return 'Navana'
    if 'google'   in p: return 'Google STT'
    if 'azure'    in p: return 'Azure STT'
    if 'sarvam'   in p: return 'Sarvam'
    return 'Deepgram'


def _path_to_tts(path: str) -> str:
    p = (path or '').lower()
    if 'elevenlabs' in p: return 'ElevenLabs'
    if 'cartesia'   in p: return 'Cartesia'
    if 'google'     in p: return 'Google TTS'
    if 'azure'      in p: return 'Azure TTS'
    if 'murf'       in p: return 'Murf'
    if 'sarvam'     in p: return 'Sarvam'
    return 'ElevenLabs'


def _stt_to_path(engine: str, barge_in: bool) -> str:
    if barge_in and engine == 'Deepgram':
        return DEEPGRAM_BARGE_PATH
    return STT_PATHS.get(engine, STT_PATHS['Deepgram'])


def _tts_to_path(engine: str) -> str:
    return TTS_PATHS.get(engine, TTS_PATHS['ElevenLabs'])


def _bool(val, default=False) -> bool:
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val.lower() == 'true'
    return default


# ── Public API ────────────────────────────────────────────────────────────────

def json_to_api(phone_number: str, raw: dict) -> dict:
    """Flatten one phone-number entry from the JSON file into the API response shape."""
    stt_params  = raw.get('stt_params') or {}
    stt_general = stt_params.get('general_parameters') or {}
    stt_trans   = stt_params.get('transcribe_parameters') or {}
    tts_params  = raw.get('tts_params') or {}
    tts_trans   = tts_params.get('transcribe_parameters') or {}
    nlu_params  = raw.get('nlu_params') or {}

    emails_raw = raw.get('emails', '')
    emails = [e.strip() for e in emails_raw.split(',') if e.strip()]

    return {
        'phone_number':    phone_number,
        'name':            raw.get('name', ''),
        'schema':          raw.get('schema_name', ''),
        'language':        raw.get('language', 'en'),
        'startup_text':    raw.get('startup_text', ''),
        'environment_type': raw.get('environment_type', 'demo'),

        # Engines (derived from provider paths)
        'stt_engine':      _path_to_stt(raw.get('stt_provider_path', '')),
        'tts_engine':      _path_to_tts(raw.get('tts_provider_path', '')),
        'filler_audio_path': raw.get('filler_audio_path', ''),

        # Feature toggles
        'enable_tts':         _bool(raw.get('enable_tts', False)),
        'barge_in_enabled':   _bool(raw.get('barge_in_enabled', False)),
        'open_socket_tts':    _bool(raw.get('is_tts_open_socket', False)),
        'enable_utterance_end': _bool(raw.get('enable_utterance_end', False)),
        'filler_audio':       _bool(raw.get('is_filler_audio_enabled', False)),

        # STT params
        'deepgram_model':   stt_general.get('DEEPGRAM_SPEECH_MODEL', 'nova-2'),
        'utterance_end_ms': stt_general.get('DEEPGRAM_SPEECH_UTTERANCE_END_MS', '1000'),
        'endpointing_ms':   stt_general.get('DEEPGRAM_SPEECH_ENDPOINTING', ''),

        # TTS params
        'tts_voice': tts_trans.get('tts_voice', ''),

        # NLU
        'nlu_model':      nlu_params.get('nlu_model', ''),
        'nlu_uuid':       str(nlu_params.get('nlu_uuid', '')),
        'agent_id':       nlu_params.get('agent_id', ''),
        'environment_id': nlu_params.get('environment_id', ''),
        'assistant_name': nlu_params.get('assistant_name', ''),
        'customer_name':  nlu_params.get('customer_name', nlu_params.get('customer_full_name', '')),
        'client_name':    nlu_params.get('client_name', ''),
        'loan_amount':    str(nlu_params.get('loan_amount', '')),
        'year':           str(nlu_params.get('year', '')),
        'month':          str(nlu_params.get('month', '')),
        'day_of_month':   str(nlu_params.get('day_of_month', '')),

        'emails': emails,
    }


def api_to_json(api_data: dict, existing_raw: dict) -> dict:
    """
    Merge the frontend's flat PATCH body back into the raw JSON format.
    Unknown fields in existing_raw are preserved unchanged.
    """
    result = copy.deepcopy(existing_raw)

    barge_in   = _bool(api_data.get('barge_in_enabled', result.get('barge_in_enabled', False)))
    stt_engine = api_data.get('stt_engine', _path_to_stt(result.get('stt_provider_path', '')))
    tts_engine = api_data.get('tts_engine', _path_to_tts(result.get('tts_provider_path', '')))

    # Top-level scalar fields
    result['name']             = api_data.get('name', result.get('name', ''))
    result['schema_name']      = api_data.get('schema', result.get('schema_name', ''))
    result['language']         = api_data.get('language', result.get('language', 'en'))
    result['startup_text']     = api_data.get('startup_text', result.get('startup_text', ''))
    result['environment_type'] = api_data.get('environment_type', result.get('environment_type', 'demo'))

    # Feature toggles
    result['enable_tts']         = _bool(api_data.get('enable_tts', result.get('enable_tts', False)))
    result['barge_in_enabled']   = barge_in
    result['is_tts_open_socket'] = _bool(api_data.get('open_socket_tts', result.get('is_tts_open_socket', False)))
    result['enable_utterance_end'] = _bool(api_data.get('enable_utterance_end', result.get('enable_utterance_end', False)))

    filler = _bool(api_data.get('filler_audio', result.get('is_filler_audio_enabled', False)))
    result['is_filler_audio_enabled'] = 'true' if filler else 'false'
    result['filler_audio_path'] = api_data.get('filler_audio_path', result.get('filler_audio_path', ''))

    # Provider paths
    result['stt_provider_path'] = _stt_to_path(stt_engine, barge_in)
    result['tts_provider_path'] = _tts_to_path(tts_engine)
    if barge_in and stt_engine == 'Deepgram':
        result['external_stt_script'] = DEEPGRAM_EXTERNAL_PATH
    elif not barge_in:
        result.pop('external_stt_script', None)

    # STT params
    if 'stt_params' not in result or not isinstance(result['stt_params'], dict):
        result['stt_params'] = {'transcribe_parameters': {}, 'general_parameters': {}}

    utterance_end = _bool(api_data.get('enable_utterance_end', result.get('enable_utterance_end', False)))
    result['stt_params'].setdefault('transcribe_parameters', {})['enable_utterance_end_detection'] = (
        'true' if utterance_end else 'false'
    )

    gp = result['stt_params'].setdefault('general_parameters', {})
    if api_data.get('deepgram_model'):
        gp['DEEPGRAM_SPEECH_MODEL'] = api_data['deepgram_model']
    if api_data.get('utterance_end_ms') not in (None, ''):
        gp['DEEPGRAM_SPEECH_UTTERANCE_END_MS'] = str(api_data['utterance_end_ms'])
    if api_data.get('endpointing_ms') not in (None, ''):
        gp['DEEPGRAM_SPEECH_ENDPOINTING'] = str(api_data['endpointing_ms'])
    elif 'DEEPGRAM_SPEECH_ENDPOINTING' in gp and api_data.get('endpointing_ms') == '':
        del gp['DEEPGRAM_SPEECH_ENDPOINTING']

    # TTS params
    if 'tts_params' not in result or not isinstance(result['tts_params'], dict):
        result['tts_params'] = {'transcribe_parameters': {}}
    if api_data.get('tts_voice'):
        result['tts_params'].setdefault('transcribe_parameters', {})['tts_voice'] = api_data['tts_voice']

    # NLU params
    if 'nlu_params' not in result or not isinstance(result['nlu_params'], dict):
        result['nlu_params'] = {}
    np = result['nlu_params']

    for key, json_key in [
        ('nlu_model', 'nlu_model'), ('nlu_uuid', 'nlu_uuid'),
        ('agent_id', 'agent_id'), ('environment_id', 'environment_id'),
        ('assistant_name', 'assistant_name'), ('customer_name', 'customer_name'),
        ('client_name', 'client_name'), ('loan_amount', 'loan_amount'),
        ('year', 'year'), ('month', 'month'), ('day_of_month', 'day_of_month'),
    ]:
        if key in api_data and api_data[key] not in (None, ''):
            np[json_key] = api_data[key]
        elif key == 'environment_id' and key in api_data:
            np[json_key] = api_data[key]  # allow empty string for environment_id

    # Emails
    emails = api_data.get('emails', [])
    if isinstance(emails, list):
        result['emails'] = ','.join(emails)
    elif isinstance(emails, str):
        result['emails'] = emails

    return result


def list_entry(phone_number: str, raw: dict) -> dict:
    """Minimal summary used by the agent list panel."""
    return {
        'phone_number': phone_number,
        'name':     raw.get('name', phone_number),
        'schema':   raw.get('schema_name', ''),
        'stt':      _path_to_stt(raw.get('stt_provider_path', '')),
        'tts':      _path_to_tts(raw.get('tts_provider_path', '')),
        'language': raw.get('language', ''),
        'status':   'active',
    }
