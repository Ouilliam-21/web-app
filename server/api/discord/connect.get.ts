import { useDefineHandler } from "~~/server/utils/handler";
import { ofetch } from "ofetch";


export interface Root {
    url: string
    session_start_limit: SessionStartLimit
    shards: number
  }

  export interface SessionStartLimit {
    max_concurrency: number
    remaining: number
    reset_after: number
    total: number
  }
  

  export interface Handshake {
    t: any
    s: any
    op: number
    d: D
  }
  
  export interface D {
    heartbeat_interval: number
    _trace: string[]
  }

  

export default useDefineHandler(async () => {
    const runtimeConfig = useRuntimeConfig();
    const discordBotToken = runtimeConfig.discordBotToken;
  console.log("onConnect");

  let voiceConnectionState = {
    sessionId: null as string | null,
    token: null as string | null,
    endpoint: null as string | null,
};
  const req1 = await ofetch<Root>("https://discord.com/api/v10/gateway/bot", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bot " + discordBotToken,
    },
  });


  const { url } = req1;

  const ws = new WebSocket(url+ "/?v=10&encoding=json");
  let voiceSocket: WebSocket | null = null;

  let heartbeatInterval: number | null = null;

  const sendHeartbeat = () => {
    if (heartbeatInterval) {
      ws.send(JSON.stringify({
        op: 1,
        d: heartbeatInterval,
      }));
    }
  }
  const identify = () =>{
    const identifyData = {
        "op": 2,
        "d": {
          "token": discordBotToken,
          "intents": 641,
          "properties": {
            "os": "linux",
            "browser": "my_library",
            "device": "my_library"
          }
        }
      }

    ws.send(JSON.stringify(identifyData));
  }

  const joinChannel = () => {
    const joinVoicePayload = {
        op: 4,
        d: {
          guild_id: "329647508659634178", 
          channel_id: "1423791061398065343",
          self_mute: false,
          self_deaf: false
        }
      };
      
      ws.send(JSON.stringify(joinVoicePayload));
  }
  

  const connectToVoiceSocket = () => {
    voiceSocket = new WebSocket("wss://" + voiceConnectionState.endpoint);
    let heartbeatvoiceInterval: number | null = null;
    let ackId  = 10;

    const sendHeartbeatVoice = () => {
      if (heartbeatvoiceInterval) {
        voiceSocket.send(JSON.stringify({
            "op": 3,
            "d": {
              "t": 1501184119561,
              "seq_ack": ackId
            }
          }
        ));
      }
    }
    const identifyVoice = () => {
        const identifyVoiceData = {
            "op": 0,
            "d": {
              "server_id": "329647508659634178",
              "user_id": "1447083966182981674",
              "session_id": voiceConnectionState.sessionId,
              "token": voiceConnectionState.token,
              "max_dave_protocol_version": 1
            }
          }
          voiceSocket.send(JSON.stringify(identifyVoiceData));
    }

    voiceSocket.onopen = () => {
      console.log("Connected to Voice WebSocket");
      identifyVoice();
    }

    voiceSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.op === 2) {
        console.log("Identified");
        console.log(data);
      }

      if (data.op === 8) {
        const handshake = data as Handshake;
        heartbeatvoiceInterval = handshake.d.heartbeat_interval;
      setInterval(sendHeartbeatVoice, heartbeatvoiceInterval);
      }

      if (data.op === 6) {
        ackId = data.d.t;
      }
    }
    
    voiceSocket.onclose = () => {
      console.log("Disconnected from Voice WebSocket");
    }

    voiceSocket.onerror = (error) => {
      console.log("Error connecting to Voice WebSocket");
      console.log(error);
    }
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.op === 10) {
      const handshake = data as Handshake;
      heartbeatInterval = handshake.d.heartbeat_interval;
      setInterval(sendHeartbeat, heartbeatInterval);
    }
    if (data.op === 11) {
      console.log("Heartbeat received");
    }

    if (data.op === 1) {
      sendHeartbeat();
    }

    if (data.op === 0) { // Dispatch Events
        if (data.t === "READY") {
            console.log("Ready received");
            joinChannel();
        }

        // 2. Wait for Voice State Update (Contains Session ID)
        if (data.t === "VOICE_STATE_UPDATE") {
            // Ensure this update is for the bot itself
            voiceConnectionState.sessionId = data.d.session_id;
            console.log("✅ Received Session ID");
        }

        // 3. Wait for Voice Server Update (Contains Token & Endpoint)
        if (data.t === "VOICE_SERVER_UPDATE") {
            voiceConnectionState.token = data.d.token;
            voiceConnectionState.endpoint = data.d.endpoint;
            console.log("✅ Received Voice Server Info", data);
        }

        // 4. Check if we have everything
        if (voiceConnectionState.sessionId && voiceConnectionState.token) {
            console.log("🚀 Both events received! Ready to connect to Voice WebSocket.");
            connectToVoiceSocket();
            
            // Clear state so it doesn't trigger twice if another update comes
            voiceConnectionState = { sessionId: null, token: null, endpoint: null };
        }
    }
    if (data.op === 2) {
      console.log("Identified");
      console.log(data);
    }

    if (data.op === 9) {
      console.log("Session Invalid too much connections");
      console.log(data);
    }

  }

  ws.onopen = () => {
    console.log("Connected to Discord");
    identify();
  }

  ws.onclose = () => {
    console.log("Disconnected from Discord");
  }

  await new Promise((resolve) => setTimeout(resolve, 50000));

  return apiSuccess({
    channels: req1,
  });
});
