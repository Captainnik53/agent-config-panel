from django.db import models


class Agent(models.Model):
    ENVIRONMENT_CHOICES = [('production', 'Production'), ('staging', 'Staging')]
    STATUS_CHOICES = [('live', 'Live'), ('active', 'Active'), ('paused', 'Paused')]

    name = models.CharField(max_length=200)
    environment = models.CharField(max_length=20, choices=ENVIRONMENT_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    template_id = models.CharField(max_length=100, blank=True)
    agent_external_id = models.CharField(max_length=100, blank=True)
    schema = models.CharField(max_length=100, blank=True)
    lang = models.CharField(max_length=50, default='en-IN')

    stt_engine = models.CharField(max_length=50, default='Deepgram')
    tts_engine = models.CharField(max_length=50, default='ElevenLabs')
    llm_model = models.CharField(max_length=100, default='gemini-flash-2.0')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.environment})"


class AgentConfig(models.Model):
    agent = models.OneToOneField(Agent, on_delete=models.CASCADE, related_name='config')

    # Calling schedule (template-level)
    calling_window_start = models.TimeField(null=True, blank=True)
    calling_window_end = models.TimeField(null=True, blank=True)
    backup_attempts = models.PositiveSmallIntegerField(default=3)
    message_start_time = models.TimeField(null=True, blank=True)
    message_stop_time = models.TimeField(null=True, blank=True)
    follow_up_duration = models.PositiveSmallIntegerField(default=24)

    # Feature toggles
    filler_audio = models.BooleanField(default=False)
    detect_voice_mail = models.BooleanField(default=True)
    barge_in = models.BooleanField(default=True)
    open_socket_tts = models.BooleanField(default=False)
    utterance_end = models.BooleanField(default=False)

    # STT params
    deepgram_model = models.CharField(max_length=50, default='nova-2')
    utterance_end_ms = models.PositiveIntegerField(default=1000)
    endpointing_ms = models.PositiveIntegerField(default=300)
    auto_punctuation = models.BooleanField(default=True)
    filler_audio_path = models.TextField(blank=True)

    # TTS params
    voice = models.CharField(max_length=100, default='Maria')
    speed = models.FloatField(default=1.0)
    stability = models.FloatField(default=0.5)
    similarity = models.FloatField(default=0.75)

    # NLU params
    nlu_uuid = models.CharField(max_length=200, blank=True)
    nlu_env_id = models.CharField(max_length=200, blank=True)

    # Staging-specific
    startup_text = models.TextField(blank=True)
    notification_emails = models.JSONField(default=list, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Config for {self.agent.name}"
