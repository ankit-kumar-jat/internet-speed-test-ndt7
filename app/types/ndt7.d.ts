export type ServerLocation = {
  city: string;
  country: string;
};

export type ServerUrls = {
  [key: string]: string;
};

export type Server = {
  location: ServerLocation;
  machine: string;
  urls: ServerUrls;
};

export type ClientMesurementData = {
  ElapsedTime: number;
  MeanClientMbps: number;
  NumBytes: number;
};

export type ServerMesurementData = {
  ConnectionInfo: {
    Client: string;
    Server: string;
    UUID: string;
  };
  BBRInfo: {
    BW: number;
    MinRTT: number;
    PacingGain: number;
    CwndGain: number;
    ElapsedTime: number;
  };
  TCPInfo: {
    State: number;
    CAState: number;
    Retransmits: number;
    Probes: number;
    Backoff: number;
    Options: number;
    WScale: number;
    AppLimited: number;
    RTO: number;
    ATO: number;
    SndMSS: number;
    RcvMSS: number;
    Unacked: number;
    Sacked: number;
    Lost: number;
    Retrans: number;
    Fackets: number;
    LastDataSent: number;
    LastAckSent: number;
    LastDataRecv: number;
    LastAckRecv: number;
    PMTU: number;
    RcvSsThresh: number;
    RTT: number;
    RTTVar: number;
    SndSsThresh: number;
    SndCwnd: number;
    AdvMSS: number;
    Reordering: number;
    RcvRTT: number;
    RcvSpace: number;
    TotalRetrans: number;
    PacingRate: number;
    MaxPacingRate: number;
    BytesAcked: number;
    BytesReceived: number;
    SegsOut: number;
    SegsIn: number;
    NotsentBytes: number;
    MinRTT: number;
    DataSegsIn: number;
    DataSegsOut: number;
    DeliveryRate: number;
    BusyTime: number;
    RWndLimited: number;
    SndBufLimited: number;
    Delivered: number;
    DeliveredCE: number;
    BytesSent: number;
    BytesRetrans: number;
    DSackDups: number;
    ReordSeen: number;
    RcvOooPack: number;
    SndWnd: number;
    ElapsedTime: number;
  };
};

export type MesurementType = "client" | "server";

export type MesurementType = ClientMesurementData | ServerMesurementData;

export type Mesurement =
  | {
      Source: "server";
      Data: ServerMesurementData;
    }
  | {
      Source: "client";
      Data: ClientMesurementData;
    };

export type CompleteMesurement = {
  LastClientMeasurement: ClientMesurementData;
  LastServerMeasurement: ServerMesurementData;
};
