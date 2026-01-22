import { getChar, isBitSet, octetOfRange, twosCompliment } from "../common";
import { getHexString, parseIndicator } from "../preprocess";

type Record = {
    [dataItem: string]: {};
};

/**
 * CAT 021 파싱
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 * @param dataItem 데이터 아이템 이름
 * @param diLength 데이터 아이템 길이
 */
const cat021Process = (record: Record, bitArr: Uint8Array, currentPos: number, dataItem: string, diLength: number) => {
    switch (dataItem) {
        case "di008": {
            di008(record, bitArr, currentPos);
            break;
        }
        case "di010": {
            di010(record, bitArr, currentPos);
            break;
        }
        case "di015": {
            di015(record, bitArr, currentPos);
            break;
        }
        case "di016": {
            di016(record, bitArr, currentPos);
            break;
        }
        case "di020": {
            di020(record, bitArr, currentPos);
            break;
        }
        case "di040": {
            di040(record, bitArr, currentPos);
            break;
        }
        case "di070": {
            di070(record, bitArr, currentPos);
            break;
        }
        case "di071": {
            di071(record, bitArr, currentPos);
            break;
        }
        case "di072": {
            di072(record, bitArr, currentPos);
            break;
        }
        case "di073": {
            di073(record, bitArr, currentPos);
            break;
        }
        case "di074": {
            di074(record, bitArr, currentPos);
            break;
        }
        case "di075": {
            di075(record, bitArr, currentPos);
            break;
        }
        case "di076": {
            di076(record, bitArr, currentPos);
            break;
        }
        case "di077": {
            di077(record, bitArr, currentPos);
            break;
        }
        case "di080": {
            di080(record, bitArr, currentPos);
            break;
        }
        case "di090": {
            di090(record, bitArr, currentPos);
            break;
        }
        case "di110": {
            di110(record, bitArr, currentPos);
            break;
        }
        case "di130": {
            di130(record, bitArr, currentPos);
            break;
        }
        case "di131": {
            di131(record, bitArr, currentPos);
            break;
        }
        case "di132": {
            di132(record, bitArr, currentPos);
            break;
        }
        case "di140": {
            di140(record, bitArr, currentPos);
            break;
        }
        case "di145": {
            di145(record, bitArr, currentPos);
            break;
        }
        case "di146": {
            di146(record, bitArr, currentPos);
            break;
        }
        case "di148": {
            di148(record, bitArr, currentPos);
            break;
        }
        case "di150": {
            di150(record, bitArr, currentPos);
            break;
        }
        case "di151": {
            di151(record, bitArr, currentPos);
            break;
        }
        case "di152": {
            di152(record, bitArr, currentPos);
            break;
        }
        case "di155": {
            di155(record, bitArr, currentPos);
            break;
        }
        case "di157": {
            di157(record, bitArr, currentPos);
            break;
        }
        case "di160": {
            di160(record, bitArr, currentPos);
            break;
        }
        case "di161": {
            di161(record, bitArr, currentPos);
            break;
        }
        case "di165": {
            di165(record, bitArr, currentPos);
            break;
        }
        case "di170": {
            di170(record, bitArr, currentPos);
            break;
        }
        case "di200": {
            di200(record, bitArr, currentPos);
            break;
        }
        case "di210": {
            di210(record, bitArr, currentPos);
            break;
        }
        case "di220": {
            di220(record, bitArr, currentPos);
            break;
        }
        case "di230": {
            di230(record, bitArr, currentPos);
            break;
        }
        case "di250": {
            di250(record, bitArr, currentPos);
            break;
        }
        case "di260": {
            di260(record, bitArr, currentPos);
            break;
        }
        case "di271": {
            di271(record, bitArr, currentPos);
            break;
        }
        case "di295": {
            di295(record, bitArr, currentPos);
            break;
        }
        case "di400": {
            di400(record, bitArr, currentPos);
            break;
        }
        case "SP": {
            sp(record, bitArr, currentPos, diLength);
            break;
        }
        case "RE": {
            re(record, bitArr, currentPos, diLength);
            break;
        }
        default:
            break;
    }
}

/**
 * Data Item I021/008, Aircraft Operational Status
 * 비행 중 항공기에서 이용 가능한 서비스 확인
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di008 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos];

    if ((octet1 & (1 << 7)) === 0) {
        record["021_008_RA"] = "TCAS II or ACAS RA not active (0)";
    } else {
        record["021_008_RA"] = "TCAS RA active (1)";
    }

    const tcOctet = octetOfRange(octet1, 6, 5, 1);
    switch (tcOctet) {
        case 0:
            record["021_008_TC"] = "no capability for Trajectory Change Reports (0)";
            break;
        case 1:
            record["021_008_TC"] = "support for TC+0 reports only (1)";
            break;
        case 2:
            record["021_008_TC"] = "support for multiple TC reports (2)";
            break;
        case 3:
            record["021_008_TC"] = "reserved (3)";
            break;
        default:
            record["021_008_TC"] = "UNDEFINED";
            break;
    }

    if ((octet1 & (1 << 4)) === 0) {
        record["021_008_TS"] = "no capability to support Target State Reports (0)";
    } else {
        record["021_008_TS"] = "capable of supporting target State Reports (1)";
    }

    if ((octet1 & (1 << 3)) === 0) {
        record["021_008_ARV"] = "no capability to generate ARV-reports (0)";
    } else {
        record["021_008_ARV"] = "capable of generate ARV-reports (1)";
    }

    if ((octet1 & (1 << 2)) === 0) {
        record["021_008_CDTI/A"] = "CDTI not operational (0)";
    } else {
        record["021_008_CDTI/A"] = "CDTI operational (1)";
    }

    if ((octet1 & (1 << 1)) === 0) {
        record["021_008_Not TCAS"] = "TCAS operational (0)";
    } else {
        record["021_008_Not TCAS"] = "TCAS not operational (1)";
    }

    if ((octet1 & (1 << 0)) === 0) {
        record["021_008_SA"] = "Antenna Diversity (0)";
    } else {
        record["021_008_SA"] = "Single Antenna only (1)";
    }
} 

/**
 * Data Item I021/010, Data Source Identifier
 * 데이터를 수신받은 시스템의 ID 값
 * 고정 길이, 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di010 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    record["021_010_SAC"] = octet1;
    record["021_010_SIC"] = octet2;
}

/**
 * Data Item I021/015, Service Identification
 * 한 명 이상의 사용자에게 제공한 서비스의 ID 값
 * 고정 길이, 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di015 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet = bitArr[currentPos];

    record["021_015_Service Identification"] = octet;
}

/**
 * Data Item I021/016, Service Management
 * 지상국 (SIC 코드로 식별됨)에서 제공하는 서비스 식별
 * 고정 길이, 1 octet
 * LSB(스케일링 계수): 0.5 s 
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di016 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet = bitArr[currentPos];

    const rpValue = octet * 0.5;

    record["021_016_RP"] = (rpValue === 0) ? "Data driven mode" : rpValue;
}

/**
 * Data Item I021/020, Emitter Category
 * 송신(출발지) ADS-B 장치의 특성
 * 고정 길이, 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di020 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet = bitArr[currentPos];

    switch (octet) {
        case 0:
            record["021_020_ECAT"] = "No ADS-B Emitter Category Information (0)";
            break;
        case 1:
            record["021_020_ECAT"] = "light aircraft <= 15500 lbs (1)";
            break;
        case 2:
            record["021_020_ECAT"] = "15500 lbs < small aircraft < 75000 lbs (2)";
            break;
        case 3:
            record["021_020_ECAT"] = "75000 lbs < medium a/c < 300000 lbs (3)";
            break;
        case 4:
            record["021_020_ECAT"] = "High Vortex Large (4)";
            break;
        case 5: 
            record["021_020_ECAT"] = "300000 lbs <= heavy aircraft (5)";
            break;
        case 6:
            record["021_020_ECAT"] = "highly manoeuvrable (5g acceleration capability) and high speed (> 400 knots cruise) (6)";
            break;
        case 7:
            record["021_020_ECAT"] = "reserved (7)";
            break;
        case 8:
            record["021_020_ECAT"] = "reserved (8)";
            break;
        case 9:
            record["021_020_ECAT"] = "reserved (9)";
            break;
        case 10:
            record["021_020_ECAT"] = "rotocraft (10)";
            break;
        case 11:
            record["021_020_ECAT"] = "glider / sailplane (11)";
            break;
        case 12:
            record["021_020_ECAT"] = "lighter-than-air (12)";
            break;
        case 13:
            record["021_020_ECAT"] = "unmanned aerial vehicle (13)";
            break;
        case 14:
            record["021_020_ECAT"] = "space / transatmospheric vehicle (14)";
            break;
        case 15:
            record["021_020_ECAT"] = "ultralight / handglider / paraglider (15)";
            break;
        case 16:
            record["021_020_ECAT"] = "parachutist / skydiver (16)";
            break;
        case 17:
            record["021_020_ECAT"] = "reserved (17)";
            break;
        case 18:
            record["021_020_ECAT"] = "reserved (18)";
            break;
        case 19:
            record["021_020_ECAT"] = "reserved (19)";
            break;
        case 20:
            record["021_020_ECAT"] = "surface emergency vehicle (20)";
            break;
        case 21:
            record["021_020_ECAT"] = "surface service vehicle (21)";
            break;
        case 22:
            record["021_020_ECAT"] = "fixed ground or tethered obstruction (22)";
            break;
        case 23:
            record["021_020_ECAT"] = "cluster obstacle (23)";
            break;
        case 24:
            record["021_020_ECAT"] = "line obstacle (24)";
            break;
        default:
            record["021_020_ECAT"] = "UNDEFINED";
            break;
    }
}

/**
 * Data Item I021/040, Target Report Descriptor
 * 시스템에 의해 전송되는 데이터의 유형 및 특성
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di040 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const atpOctet = octetOfRange(octet1, 7, 5, 2);
    switch (atpOctet) {
        case 0:
            record["021_040_ATP"] = "24-Bit ICAO address (0)";
            break;
        case 1:
            record["021_040_ATP"] = "Duplicate address (1)";
            break;
        case 2:
            record["021_040_ATP"] = "Surface vehicle address (2)";
            break;
        case 3:
            record["021_040_ATP"] = "Anonymous address (3)";
            break;
        case 4:
            record["021_040_ATP"] = "Reserved for future use (4)";
            break;
        case 5:
            record["021_040_ATP"] = "Reserved for future use (5)";
            break;
        case 6:
            record["021_040_ATP"] = "Reserved for future use (6)";
            break;
        case 7:
            record["021_040_ATP"] = "Reserved for future use (7)";
            break;
        default:
            record["021_040_ATP"] = "UNDEFINED";
            break;
    }

    const arcOctet = octetOfRange(octet1, 4, 3, 1);
    switch (arcOctet) {
        case 0:
            record["021_040_ARC"] = "25 ft (0)";
            break;
        case 1:
            record["021_040_ARC"] = "100 ft (1)";
            break;
        case 2:
            record["021_040_ARC"] = "Unknown (2)";
            break;
        case 3:
            record["021_040_ARC"] = "Invalid (3)";
            break;
        default:
            record["021_040_ARC"] = "UNDEFINED";
            break;
    }

    if ((octet1 & (1 << 2)) === 0) {
        record["021_040_RC"] = "Default (0)";
    } else {
        record["021_040_RC"] = "Range Check passed, CPR Validation pending (1)";
    }

    if ((octet1 & (1 << 1)) === 0) {
        record["021_040_RAB"] = "Report from target transponder (0)";
    } else {
        record["021_040_RAB"] = "Report from field monitor (fixed transponder) (1)";
    }

    if ((octet1 & 1) == 0) return;

    const octet2 = bitArr[currentPos++];

    if ((octet2 & (1 << 7)) === 0) {
        record["021_040_DRC"] = "No differential correction (ADS-B) (0)";
    } else {
        record["021_040_DRC"] = "Differential correction (ADS-B) (1)";
    }

    if ((octet2 & (1 << 6)) === 0) {
        record["021_040_GBS"] = "Ground Bit not set (0)";
    } else {
        record["021_040_GBS"] = "Ground Bit set (1)";
    }

    if ((octet2 & (1 << 5)) === 0) {
        record["021_040_SIM"] = "Actual target report (0)";
    } else {
        record["021_040_SIM"] = "Simulated target report (1)";
    }

    if ((octet2 & (1 << 4)) === 0) {
        record["021_040_TST"] = "Default (0)";
    } else {
        record["021_040_TST"] = "Test Target (1)";
    }

    if ((octet2 & (1 << 3)) === 0) {
        record["021_040_SAA"] = "Equipment capable to provide Selected Altitude (0)";
    } else {
        record["021_040_SAA"] = "Equipment not capable to provide Selected Altitude (1)";
    }

    const clOctet = octetOfRange(octet2, 2, 1, 1);
    switch (clOctet) {
        case 0:
            record["021_040_CL"] = "Report valid (0)";
            break;
        case 1:
            record["021_040_CL"] = "Report suspect (1)";
            break;
        case 2:
            record["021_040_CL"] = "No information (2)";
            break;
        case 3:
            record["021_040_CL"] = "Reserved for future use (3)";
            break;
        default:
            record["021_040_CL"] = "UNDEFINED";
            break;
    }

    if ((octet2 & 1) == 0) return;

    const octet3 = bitArr[currentPos++];

    if ((octet3 & (1 << 6)) === 0) {
        record["021_040_LLC"] = "default (0)";
    } else {
        record["021_040_LLC"] = "Target is suspect (see note) (1)";
    }

    if ((octet3 & (1 << 5)) === 0) {
        record["021_040_IPC"] = "default (see note) (0)";
    } else {
        record["021_040_IPC"] = "Independent Position Check failed (1)";
    }

    if ((octet3 & (1 << 4)) === 0) {
        record["021_040_NOGO"] = "NOGO-bit not set (0)";
    } else {
        record["021_040_NOGO"] = "NOGO-bit set (1)";
    }

    if ((octet3 & (1 << 3)) === 0) {
        record["021_040_CPR"] = "CPR Validation correct (0)";
    } else {
        record["021_040_CPR"] = "CPR Validation failed (1)";
    }

    if ((octet3 & (1 << 2)) === 0) {
        record["021_040_LDPJ"] = "LDPJ not detected (0)";
    } else {
        record["021_040_LDPJ"] = "LDPJ detected (1)";
    }

    if ((octet3 & (1 << 1)) === 0) {
        record["021_040_RCF"] = "default (0)";
    } else {
        record["021_040_RCF"] = "Range Check failed (1)";
    }
}

/**
 * Data Item I021/070, Mode 3/A Code in Octal Representation
 * 8진수 표현으로 변환된 Mode-3/A 코드
 * 고정 길이, 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di070 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const aStr = octetOfRange(octet1, 3, 1, 2).toString();
    const bStr = ((octetOfRange(octet1, 0, 0, 0) << 2) | octetOfRange(octet2, 7, 6, 1)).toString();
    const cStr = octetOfRange(octet2, 5, 3, 2).toString();
    const dStr = octetOfRange(octet2, 2, 0, 2).toString();

    record["021_070_Mode-3/A"] = aStr + bStr + cStr + dStr;
}

/**
 * Data Item I021/071, Time of Applicability for Position
 * 보고된 위치 정보의 유효 시간 (지난 자정 이후 경과된 시간 형태, 협정 세계시(UTC)로 표시)
 * 고정 길이, 3 octet
 * LSB(스케일링 계수): 1/128 s
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di071 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const tapOctet = (octet1 << (8 * 2)) | (octet2 << (8)) | (octet3);

    record["021_071_Time of Applicability of Position"] = (tapOctet / 128);
}

/**
 * Data Item I021/072, Time of Applicability for Velocity
 * 보고된 속도 정보의 유효 시간 (측정 시점), (지난 자정 이후 경과된 시간 형태, 협정 세계시(UTC)로 표시)
 * 고정 길이, 3 octet
 * LSB(스케일링 계수): 1/128 s
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di072 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const tavOctet = (octet1 << (8 * 2)) | (octet2 << (8)) | (octet3);

    record["021_072_Time of Applicability of Velocity"] = tavOctet / 128;
}

/**
 * Data Item I021/073, Time of Message Reception for Position
 * 지상국에서 최종 위치 스퀴터(Squitter)를 수신한 시간 (지난 자정 이후 경과된 시간 형태, 협정 세계시(UTC)로 표시
 * 고정 길이, 3 octet
 * LSB(스케일링 계수): 1/128 s
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di073 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const tmrpOctet = (octet1 << (8 * 2)) | (octet2 << (8)) | (octet3);

    record["021_073_Time of Message Reception of Position"] = tmrpOctet / 128;
}

/**
 * Data Item I021/074, Time of Message Reception of Position–High Precision
 * 지상국이 최종 ADS-B 위치 정보를 수신한 시각 (UTC 시각의 초 단위 이하(분수)로 표현)
 * 고정 길이, 4 octet
 * LSB(스케일링 계수): 2^-30s
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di074 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const fsiOctet = octetOfRange(octet1, 7, 6, 1);
    switch (fsiOctet) {
        case 0:
            record["021_074_FSI"] = "TOMRp whole seconds = (I021/073) Whole seconds (0)";
            break;
        case 1:
            record["021_074_FSI"] = "TOMRp whole seconds = (I021/073) Whole seconds + 1 (1)";
            break;
        case 2:
            record["021_074_FSI"] = "TOMRp whole seconds = (I021/073) Whole seconds - 1 (2)";
            break;
        case 3:
            record["021_074_FSI"] = "Reserved (3)";
            break;
        default:
            record["021_074_FSI"] = "UNDEFINED";
            break;
    }

    const tmrpFrontOctet = octetOfRange(octet1, 5, 0, 5);

    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];
    const octet4 = bitArr[currentPos++];

    const tmrpOctet = (tmrpFrontOctet << (8 * 3)) | (octet2 << (8 * 2)) | (octet3 << (8)) | octet4;

    const tmrp = tmrpOctet / (1 << 30);

    record["021_074_Time of Message Reception of Position - high precision"] = tmrp;
}

/**
 * Data Item I021/075, Time of Message Reception for Velocity
 * 지상국에서 최종 속도 스퀴터(Squitter)를 수신한 시간 (지난 자정 이후 경과된 시간 형태, 협정 세계시(UTC)로 표시)
 * 고정 길이, 3 octet
 * LSB(스케일링 계수): 1/128 s
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di075 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const ttiOctet = (octet1 << (8 * 2)) | (octet2 << (8)) | (octet3);

    record["021_075_Time of Message Reception of Velocity"] = ttiOctet / 128;
}

/**
 * Data Item I021/076, Time of Message Reception of Velocity–High Precision
 * 지상국이 최종 ADS-B 속도 정보를 수신한 시각 (UTC 시각의 초 단위 이하(분수)로 표현
 * 고정 길이, 4 octet
 * LSB(스케일링 계수): 2^-30s
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di076 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const fsiOctet = octetOfRange(octet1, 7, 6, 1);
    switch (fsiOctet) {
        case 3:
            record["021_076_FSI"] = "Reserved (3)";
            break;
        case 2:
            record["021_076_FSI"] = "TOMRv whole seconds = (I021/075) Whole seconds - 1 (2)";
            break;
        case 1:
            record["021_076_FSI"] = "TOMRv whole seconds = (I021/075) Whole seconds + 1 (1)";
            break;
        case 0:
            record["021_076_FSI"] = "TOMRv whole seconds = (I021/075) Whole seconds (0)";
            break;
        default:
            record["021_076_FSI"] = "UNDEFINED";
            break;
    }

    const tmrvFrontOctet = octetOfRange(octet1, 5, 0, 5);

    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];
    const octet4 = bitArr[currentPos++];

    const tmrvOctet = (tmrvFrontOctet << (8 * 3)) | (octet2 << (8 * 2)) | (octet3 << (8)) | octet4;

    const tmrv = tmrvOctet / (1 << 30);

    record["021_076_Time of Message Reception of Velocity - high precision"] = tmrv;
}

/**
 * Data Item I021/077, Time of ASTERIX Report Transmission
 * ASTERIX 카테고리 021 보고서 송신 시각 (지난 자정 이후 경과된 시간 형태, 협정 세계시(UTC)로 표시)
 * 고정 길이, 3 octet
 * LSB(스케일링 계수): 1/128 s
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di077 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const ttiOctet = octet1 << (8 * 2) | octet2 << (8) | octet3;

    record["021_077_Time of ASTERIX Report Transmission"] = ttiOctet / 128;
}

/**
 * Data Item I021/080, Target Address
 * 타겟의 주소
 * 고정 길이, 3 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di080 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const taOctet = (octet1 << (8 * 2)) | (octet2 << 8) | octet3;

    record["021_080_Target Address"] = taOctet.toString(16).toUpperCase().padStart(6, '0');
};

/**
 * Data Item I021/090, Quality Indicators
 * MOPS 버전에 따라 항공기(a/c)가 송신하는 ADS-B 품질 지표
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di090 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const nuacOctet = octetOfRange(octet1, 7, 5, 2);

    record["021_090_NUCrorNACv"] = nuacOctet;

    const nuicOctet = octetOfRange(octet1, 4, 1, 3);

    record["021_090_NUCporNIC"] = nuicOctet;

    // 마지막 비트가 0이면 종료
    if ((octet1 & 1) == 0) return;

    const octet2 = bitArr[currentPos++];

    const nicOctet = (octet2 & (1 << 7)) !== 0 ? 1 : 0;

    record["021_090_NICbaro"] = nicOctet;

    const silOctet = octetOfRange(octet2, 6, 5, 1);

    record["021_090_SIL"] = silOctet;

    const nacpOctet = octetOfRange(octet2, 4, 1, 3);

    record["021_090_NACp"] = nacpOctet;

    // 마지막 비트가 0이면 종료
    if ((octet2 & 1) == 0) return;

    const octet3 = bitArr[currentPos++];

    const silsOctet = (octet3 & (1 << 5)) !== 0 ? 1 : 0;

    record["021_090_SILS"] = silsOctet;

    const sdaOctet = octetOfRange(octet3, 4, 3, 1);
    
    record["021_090_SDA"] = sdaOctet;

    const gvaOctet = octetOfRange(octet3, 2, 1, 1);
    
    record["021_090_GVA"] = gvaOctet;

    if ((octet3 & 1) == 0) return;

    const octet4 = bitArr[currentPos++];

    const picOctet = octetOfRange(octet4, 7, 4, 3);

    record["021_090_PIC"] = picOctet;
}

/**
 * Data Item I021/110, Trajectory Intent
 * 항공기의 4D 예상(계획) 경로를 나타내는 보고서
 * 가변 길이
 * TID - 2의 보수 처리 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di110 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) !== 0) {
        // TIS O
        di110TIS(record, bitArr, currentPos);
        currentPos++;
    } 

    if ((octet1 & (1 << 6)) !== 0) {
        // TID O
        di110TID(record, bitArr, currentPos);
        currentPos++;
    }
}

/**
 * Data Item I021/110, Subfield 1
 * Trajectory Intent Status
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di110TIS = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    // NAV
    if ((octet1 & (1 << 7)) === 0) {
        record["021_110_NAV"] = "Trajectory Intent Data is available for this aircraft (0)";
    } else {
        record["021_110_NAV"] = "Trajectory Intent Data is not available for this aircraft (1)";
    }

    // NVB
    if ((octet1 & (1 << 6)) === 0) {
        record["021_110_NVB"] = "Trajectory Intent Data is valid (0)";
    } else {
        record["021_110_NVB"] = "Trajectory Intent Data is not valid (1)";
    }
}

/**
 * Data Item I021/110, Subfield 2
 * Trajectory Intent Data
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di110TID = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    for (let index = 0; index < octet1; index++) {
        const octet2 = bitArr[currentPos++];

        if ((octet2 & (1 << 7)) === 0) {
            record["021_110_NVB_" + (index + 1)] = "Trajectory Intent Data is valid (0)";
        } else {
            record["021_110_NVB_" + (index + 1)] = "Trajectory Intent Data is not valid (1)";
        }

        if ((octet2 & (1 << 6)) === 0) {
            record["021_110_NC_" + (index + 1)] = "TCP compliance (0)";
        } else {
            record["021_110_NC_" + (index + 1)] = "TCP non-compliance (1)";
        }

        record["021_110_TCP number_" + (index + 1)] = octetOfRange(octet2, 5, 0, 5);

        const octet3 = bitArr[currentPos++];
        const octet4 = bitArr[currentPos++];

        const altOctet = (octet3 << (8)) | octet4;

        const alt = twosCompliment(altOctet, 16) * 10;

        record["021_110_Altitude_" + (index + 1)] = alt;

        const octet5 = bitArr[currentPos++];
        const octet6 = bitArr[currentPos++];
        const octet7 = bitArr[currentPos++];

        const latOctet = octet5 << (8 * 2) | octet6 << (8) | octet7;

        const octet8 = bitArr[currentPos++];
        const octet9 = bitArr[currentPos++];
        const octet10 = bitArr[currentPos++];

        const lonOctet = octet8 << (8 * 2) | octet9 << (8) | octet10;

        const lat = twosCompliment(latOctet, 24) * 180.0 / (1 << 23);
        const lon = twosCompliment(lonOctet, 24) * 180.0 / (1 << 23);

        record["021_110_Latitude In WGS-84_" + (index + 1)] = lat;
        record["021_110_Longitude In WGS-84_" + (index + 1)] = lon;

        const octet11 = bitArr[currentPos++];

        const ptOctet = octetOfRange(octet11, 7, 4, 3);
        switch (ptOctet) {
            case 0:
                record["021_110_Point Type_" + (index + 1)] = "Unknown (0)";
                break;
            case 1:
                record["021_110_Point Type_" + (index + 1)] = "Fly by waypoint (LT) (1)";
                break;
            case 2:
                record["021_110_Point Type_" + (index + 1)] = "Fly over waypoint (LT) (2)";
                break;
            case 3:
                record["021_110_Point Type_" + (index + 1)] = "Hold pattern (LT) (3)";
                break;
            case 4:
                record["021_110_Point Type_" + (index + 1)] = "Procedure hold (LT) (4)";
                break;
            case 5:
                record["021_110_Point Type_" + (index + 1)] = "Procedure turn (LT) (5)";
                break;
            case 6:
                record["021_110_Point Type_" + (index + 1)] = "RF leg (LT) (6)";
                break;
            case 7:
                record["021_110_Point Type_" + (index + 1)] = "Top of climb (VT) (7)";
                break;
            case 8:
                record["021_110_Point Type_" + (index + 1)] = "Top of descent (VT) (8)";
                break;
            case 9:
                record["021_110_Point Type_" + (index + 1)] = "Start of level (VT) (9)";
                break;
            case 10:
                record["021_110_Point Type_" + (index + 1)] = "Cross-over altitude (VT) (10)";
                break;
            case 11:
                record["021_110_Point Type_" + (index + 1)] = "Transition altitude (VT) (11)";
                break;
            default:
                record["021_110_Point Type_" + (index + 1)] = "UNDEFINED";
                break;
        }

        const tdOctet = octetOfRange(octet11, 3, 2, 1);
        switch (tdOctet) {
            case 0:
                record["021_110_TD_" + (index + 1)] = "N/A (0)";
                break;
            case 1:
                record["021_110_TD_" + (index + 1)] = "Turn right (1)";
                break;
            case 2:
                record["021_110_TD_" + (index + 1)] = "Turn left (2)";
                break;
            case 3:
                record["021_110_TD_" + (index + 1)] = "No turn (3)";
                break;
            default:
                record["021_110_TD_" + (index + 1)] = "UNDEFINED";
                break;
        }

        if ((octet11 & (1 << 1)) === 0) {
            record["021_110_TRA_" + (index + 1)] = "TTR not available (0)";
        } else {
            record["021_110_TRA_" + (index + 1)] = "TTR available (1)";
        }

        if ((octet11 & (1)) === 0) {
            record["021_110_TOA_" + (index + 1)] = "TOV available (0)";
        } else {
            record["021_110_TOA_" + (index + 1)] = "TOV not available (1)";
        }

        const octet12 = bitArr[currentPos++];
        const octet13 = bitArr[currentPos++];
        const octet14 = bitArr[currentPos++];

        const tovOctet = octet12 << (8 * 2) | octet13 << (8) | octet14;

        record["021_110_TOV_" + (index + 1)] = tovOctet;

        const octet15 = bitArr[currentPos++];
        const octet16 = bitArr[currentPos++];

        const ttrOctet = octet15 << (8) | octet16;

        record["021_110_TTR_" + (index + 1)] = ttrOctet * 0.01;
    }
}

/**
* Data Item I021/130, Position in WGS-84 Co-ordinates
 * WGS-84 좌표계 기준 위치
 * 고정 길이, 6 octet
 * 2의 보수 처리 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di130 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const latOctet = (octet1 << (8 * 2)) | (octet2 << 8) | octet3;

    const octet4 = bitArr[currentPos++];
    const octet5 = bitArr[currentPos++];
    const octet6 = bitArr[currentPos++];

    const lonOctet = (octet4 << (8 * 2)) | (octet5 << 8) | octet6;

    const lat = twosCompliment(latOctet, 24) * 180.0 / (1 << 23);
    const lon = twosCompliment(lonOctet, 24) * 180.0 / (1 << 23);

    record["021_130_Latitude In WGS-84"] = lat;
    record["021_130_Longitude In WGS-84"] = lon;
}

/**
 * Data Item I021/131, High-Resolution Position in WGS-84 Co-ordinates
 * WGS-84 좌표계 기준 위치
 * 고정 길이, 8 octet
 * 2의 보수 처리 필요 
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di131 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];
    const octet4 = bitArr[currentPos++];

    const latOctet = (octet1 << (8 * 3)) | (octet2 << (8 * 2)) | (octet3 << 8) | octet4;

    const octet5 = bitArr[currentPos++];
    const octet6 = bitArr[currentPos++];
    const octet7 = bitArr[currentPos++];
    const octet8 = bitArr[currentPos++];

    const lonOctet = (octet5 << (8 * 3)) | (octet6 << (8 * 2)) | (octet7 << 8) | octet8;

    const lat = twosCompliment(latOctet, 32) * 180.0 / (1 << 30);
    const lon = twosCompliment(lonOctet, 32) * 180.0 / (1 << 30);

    record["021_131_Latitude In WGS-84"] = lat;
    record["021_131_Longitude In WGS-84"] = lon;
}

/**
 * Data Item I021/132, Message Amplitude
 * 지상국에서 수신한 ADS-B 메시지의 진폭(dBm 단위)으로, 2의 보수 방식으로 인코딩됨
 * 고정 길이, 1 octet
 * LSB(스케일링 계수): 1 dBm
 * 2의 보수 처리 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di132 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const mam = twosCompliment(octet1, 8);

    record["021_132_MAM"] = mam;
}

/**
 * Data Item I021/140, Geometric Height
 * WGS-84로 정의된 지구 타원체의 접평면으로부터의 최소 높이이며, 2의 보수 형식으로 표현됨
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 6.25 ft
 * 2의 보수 처리 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di140 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const geoAltOctet = octet1 << (8) | octet2;

    const geoAlt = twosCompliment(geoAltOctet, 16) * 6.25

    record["021_140_Geometric Height (GH)"] = geoAlt;
}

/**
 * Data Item I021/145, Flight Level
 * QNH 보정을 거치지 않은 기압 측정치 기반의 비행 고도(Flight Level)이며, 2의 보수 형식으로 표현됨
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 1 / 4 FL
 * 2의 보수 처리 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di145 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const flOctet = (octet1 << 8) | octet2;

    const fl = twosCompliment(flOctet, 16) * 0.25;

    record["021_145_Fligth Level"] = fl;
}

/**
 * Data Item I021/146, Selected Altitude
 * 항공 전자 장치(Avionics)에서 제공되는 선택 고도(Selected Altitude)로,
 * 조종사가 MCP/FCU에 입력한 관제 지시 고도(ATC Cleared Altitude) 또는 FMS(비행 관리 시스템) 선택 고도 중 하나에 해당함
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 25ft
 * 2의 보수 처리 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di146 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    
    if ((octet1 & (1 << 7)) === 0) {
        record["021_146_SAS"] = "No source information provided (0)";
    } else {
        record["021_146_SAS"] = "Source Information provided (1)";
    }

    const sourceOctet = octetOfRange(octet1, 6, 5, 1);
    switch (sourceOctet) {
        case 0:
            record["021_146_Source"] = "Unknown (0)";
            break;
        case 1:
            record["021_146_Source"] = "Aircraft Altitude (Holding Altitude) (1)";
            break;
        case 2:
            record["021_146_Source"] = "MCP/FCU Selected Altitude (2)";
            break;
        case 3:
            record["021_146_Source"] = "FMS Selected Altitude (3)";
            break;
        default:
            record["021_146_Source"] = "UNDEFINED";
            break;
    }

    const altFrontOctet = octetOfRange(octet1, 4, 0, 4);

    const octet2 = bitArr[currentPos++];

    const altOctet = altFrontOctet << (8) | octet2;

    const alt = twosCompliment(altOctet, 13) * 25;

    record["021_146_Altitude"] = alt;
}

/**
 * Data Item I021/148, Final State Selected Altitude
 * 고도 제어 패널(MCP/FCU)로부터 추출된, 항공 교통 관제(ATC) 승인 고도와 일치하는 수직 의도(Vertical Intent) 값
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 25ft
 * 2의 보수 처리 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di148 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) === 0) {
        record["021_148_MV"] = "Not active or unknown (0)";
    } else {
        record["021_148_MV"] = "Active (1)";
    }

    if ((octet1 & (1 << 6)) === 0) {
        record["021_148_AH"] = "Not active or unknown (0)";
    } else {
        record["021_148_AH"] = "Active (1)";
    }

    if ((octet1 & (1 << 5)) === 0) {
        record["021_148_AM"] = "Not active or unknown (0)";
    } else {
        record["021_148_AM"] = "Active (1)";
    }

    const altFrontOctet = octetOfRange(octet1, 4, 0, 4);

    const octet2 = bitArr[currentPos++];

    const altOctet = altFrontOctet << (8) | octet2;

    const alt = twosCompliment(altOctet, 13) * 25;

    record["021_148_Altitude"] = alt;
}

/**
 * Data Item I021/150, Air Speed
 * 산출 대기 속도 (공기 벡터의 구성 요소)
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 2^-14 NM/s / 0.001
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di150 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const asFrontOctet = octetOfRange(octet1, 6, 0, 6);

    const octet2 = bitArr[currentPos++];

    const asOctet = (asFrontOctet << 8) | octet2;

    if ((octet1 & (1 << 7)) === 0) {
        record["021_150_IM"] = "Air Speed = IAS (1)";
        record["021_150_Air Speed"] = asOctet / (1 << 14);
    } else {
        record["021_150_IM"] = "Air Speed = Mach (0)";
        record["021_150_Air Speed"] = asOctet * 0.001;
    }
}

/**
 * Data Item I021/151 True Airspeed
 * 진대기 속도
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 1 knot
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di151 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) === 0) {
        record["021_150_IM"] = "Value in defined range (0)";
    } else {
        record["021_150_IM"] = "Value exceeds defined range (1)";
    }
    
    const tasFrontOctet = octetOfRange(octet1, 6, 0, 6);
    
    const octet2 = bitArr[currentPos++];
    
    const tasOctet = tasFrontOctet << (8) | octet2;
    
    record["021_151_True Air Speed"] = tasOctet;
}

/**
 * Data Item I021/152, Magnetic Heading
 * 항공기의 기수(코 부분)가 가리키는 방향을 자북(지구 자기장의 북쪽)을 기준으로 측정된 각도
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 360 / 2^16
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di152 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    
    const mhOctet = (octet1 << 8) | octet2;

    const mh = (mhOctet * 360.0) / (1 << 16);

    record["021_152_Magnetic Heading"] = mh;
}

/**
 * Data Item I021/155, Barometric Vertical Rate
 * 기압 수직 속도이며, 2의 보수 형식으로 표현됨
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 6.25 feet/minute
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di155 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) === 0) {
        record["021_155_RE"] = "Value in defined range (0)";
    } else {
        record["021_155_RE"] = "Value exceeds defined range (1)";
    }
    
    const bvrFrontOctet = octetOfRange(octet1, 6, 0, 6);
    
    const octet2 = bitArr[currentPos++];
    
    const bvrOctet = bvrFrontOctet << (8) | octet2;

    const bvr = twosCompliment(bvrOctet, 15) * 6.25;
    
    record["021_155_Barometric Vertical Rate"] = bvr;
}

/**
 * Data Item I021/157, Geometric Vertical Rate
 * WGS-84를 기준으로 한 기하학적 수직 속도이며, 2의 보수 형식으로 표현됨
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 6.25 feet/minute
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di157 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) === 0) {
        record["021_157_RE"] = "Value in defined range (0)";
    } else {
        record["021_157_RE"] = "Value exceeds defined range (1)";
    }
    
    const bvrFrontOctet = octetOfRange(octet1, 6, 0, 6);
    
    const octet2 = bitArr[currentPos++];
    
    const bvrOctet = bvrFrontOctet << (8) | octet2;

    const bvr = twosCompliment(bvrOctet, 15) * 6.25;
    
    record["021_157_Geometric Vertical Rate"] = bvr;
}

/**
 * Data Item I021/160, Airborne Ground Vector
 * 공중 지면 벡터(Airborne Ground Vector)의 구성 요소인 지표 속도(Ground Speed)와 지적(Track Angle)
 * 고정 길이, 4 octet
 * LSB(스케일링 계수): 2^-14 NM/s
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di160 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) === 0) {
        record["021_160_RE"] = "Value in defined range (0)";
    } else {
        record["021_160_RE"] = "Value exceeds defined range (1)";
    }
    
    const gsFrontOctet = octetOfRange(octet1, 6, 0, 6);

    const octet2 = bitArr[currentPos++];

    const gsOctet = gsFrontOctet << (8) | octet2;

    const gs = gsOctet / (1 << 14);

    record["021_160_Ground Speed"] = gs;

    const octet3 = bitArr[currentPos++];
    const octet4 = bitArr[currentPos++];

    const taOctet = (octet3 << 8) | octet4;

    const ta = (taOctet * 360) / (1 << 16);

    record["021_160_Track Angle"] = ta;
}

/**
 * Data Item I021/161, Track Number
 * 특정 트랙 파일 내에서 개별 트랙 기록을 구분하는 고유한 참조용 정수 값
 * 고정 길이, 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di161 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const tnFrontOctet = octetOfRange(octet1, 3, 0, 3);

    const octet2 = bitArr[currentPos++];

    const tnOctet = (tnFrontOctet << 8) | octet2;

    record["021_161_TRACK NUMBER"] = tnOctet;
}

/**
 * Data Item I021/165, Track Angle Rate
 * 2의 보수 형식으로 표현된 선회율(회전 속도)
 * 고정 길이, 4 octet
 * LSB(스케일링 계수): 1/32 °/s
 * 2의 보수 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di165 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    
    const tarFrontOctet = octetOfRange(octet1, 1, 0, 1);

    const octet2 = bitArr[currentPos++];

    const tarOctet = tarFrontOctet << (8) | octet2;

    const tar = tarOctet / 32;

    record["021_165_TAR"] = tar;
}

/**
 * Data Item I021/170, Target Identification
 * 타겟(항공기 또는 차량)이 보고한 8자 이내의 고유 식별 정
 * 고정 길이, 6 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di170 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const char123Octet = (octet1 << (8 * 2)) | (octet2 << 8) | octet3;

    const char1Octet = octetOfRange(char123Octet, 23, 18, 5);
    const char2Octet = octetOfRange(char123Octet, 17, 12, 5);
    const char3Octet = octetOfRange(char123Octet, 11, 6, 5);
    const char4Octet = octetOfRange(char123Octet, 5, 0, 5);

    const octet4 = bitArr[currentPos++];
    const octet5 = bitArr[currentPos++];
    const octet6 = bitArr[currentPos++];

    const char456Octet = (octet4 << (8 * 2)) | (octet5 << 8) | octet6;

    const char5Octet = octetOfRange(char456Octet, 23, 18, 5);
    const char6Octet = octetOfRange(char456Octet, 17, 12, 5);
    const char7Octet = octetOfRange(char456Octet, 11, 6, 5);
    const char8Octet = octetOfRange(char456Octet, 5, 0, 5);

    const convertedChars = [
        char1Octet, char2Octet, char3Octet, char4Octet,
        char5Octet, char6Octet, char7Octet, char8Octet
    ].map(code => getChar(code)) // 숫자를 문자로 변환
    .filter(char => char !== "") // 빈 문자열("") 제거 
    .join("");                   // 하나의 문자열로 합치기 

    record["021_170_Target Identification"] = convertedChars;
}

/**
 * Data Item I021/200, Target Status
 * 타겟(추적 대상)의 상태
 * 고정 길이, 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di200 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) === 0) {
        record["021_200_ICF"] = "No intent change active (0)";
    } else {
        record["021_200_ICF"] = "Intent change flag raised (1)";
    }

    if ((octet1 & (1 << 6)) === 0) {
        record["021_200_LNAV"] = "LNAV Mode engaged (0)";
    } else {
        record["021_200_LNAV"] = "LNAV Mode not engaged (1)";
    }

    if ((octet1 & (1 << 5)) === 0) {
        record["021_200_ME"] = "No military emergency (0)";
    } else {
        record["021_200_ME"] = "Military emergency (1)";
    }

    const psOctet = octetOfRange(octet1, 4, 2, 2);
    switch (psOctet) {
        case 0:
            record["021_200_PS"] = "No emergency / not reported (0)";
            break;
        case 1:
            record["021_200_PS"] = "General emergency (1)";
            break;
        case 2:
            record["021_200_PS"] = "Lifeguard / medical emergency (2)";
            break;
        case 3:
            record["021_200_PS"] = "Minimum fuel (3)";
            break;
        case 4:
            record["021_200_PS"] = "No communications (4)";
            break;
        case 5:
            record["021_200_PS"] = "Unlawful interference (5)";
            break;
        case 6:
            record["021_200_PS"] = "'Downed' Aircraft (6)";
            break;
        default:
            record["021_200_PS"] = "UNDEFINED";
            break;
    }

    const ssOctet = octetOfRange(octet1, 1, 0, 1);
    switch (ssOctet) {
        case 0:
            record["021_200_SS"] = "No condition reported (0)";
            break;
        case 1:
            record["021_200_SS"] = "Permanent Alert (Emergency condition) (1)";
            break;
        case 2:
            record["021_200_SS"] = "Temporary Alert (change in Mode 3/A Code other than emergency) (2)";
            break;
        case 3:
            record["021_200_SS"] = "SPI set (3)";
            break;
        default:
            record["021_200_SS"] = "UNDEFINED";
            break;
    }
}

/**
 * Data Item I021/210, MOPS Version
 * 항공기(a/c)가 ADS-B 데이터를 송신하기 위해 사용하는 MOPS(최소 운용 성능 표준) 버전 식별
 * 고정 길이, 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di210 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 6)) === 0) {
        record["021_210_VNS"] = "The MOPS Version is supported by the GS (0)";
    } else {
        record["021_210_VNS"] = "The MOPS Version is not supported by the GS (1)";
    }

    const vnOctet = octetOfRange(octet1, 5, 3, 2);
    switch (vnOctet) {
        case 0:
            record["021_210_VN"] = "ED102/DO-260 [Ref. 7] (0)";
            break;
        case 1:
            record["021_210_VN"] = "DO-260A [Ref. 8] (1)";
            break;
        case 2:
            record["021_210_VN"] = "ED102A/DO-260B [Ref. 10] (2)";
            break;
        case 3:
            record["021_210_VN"] = "ED-102B/DO-260C [Ref. 11] (3)";
            break;
        default:
            record["021_210_VN"] = "UNDEFINED";
            break;
    }

    const lttOctet = octetOfRange(octet1, 2, 0, 2);
    switch (lttOctet) {
        case 0:
            record["021_210_LTT"] = "Other (0)";
            break;
        case 1:
            record["021_210_LTT"] = "UAT (1)";
            break;
        case 2:
            record["021_210_LTT"] = "1090 ES (2)";
            break;
        case 3:
            record["021_210_LTT"] = "VDL 4 (3)";
            break;
        case 4:
            record["021_210_LTT"] = "Not assigned (4)";
            break;
        case 5:
            record["021_210_LTT"] = "Not assigned (5)";
            break;
        case 6:
            record["021_210_LTT"] = "Not assigned (6)";
            break;
        case 7:
            record["021_210_LTT"] = "Not assigned (7)";
            break;
        default:
            record["021_210_LTT"] = "UNDEFINED";
            break;
    }
}

/**
 * Data Item I021/220, Met Information
 * 기상 정보
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di220 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) != 0) {
        // WS 
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const wsOctet = (octet1 << 8) | octet2;

        record["021_220_Wind Speed"] = wsOctet;
    }

    if ((octet1 & (1 << 6)) != 0) {
        // WD
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const wdOctet = (octet1 << 8) | octet2;

        record["021_220_Wind Direction"] = wdOctet;
    }

    if ((octet1 & (1 << 5)) != 0) {
        // TMP
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const wdOctet = (octet1 << 8) | octet2;

        record["021_220_Temperature"] = wdOctet;
    }

    if ((octet1 & (1 << 4)) != 0) {
        // TRB
        const octet1 = bitArr[currentPos++];

        record["021_220_Turbulence"] = octet1;
    }
}

/**
 * Data Item I021/230, Roll Angle
 * 선회 중인 항공기의 롤 각도(Roll Angle, 경사각)를 2의 보수 형식으로 표현한 것
 * 고정 길이, 2 octet
 * LSB(스케일링 계수): 0.01 degree
 * 2의 보수 필요
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di230 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const raOctet = (octet1 << 8) | octet2;

    const ra = twosCompliment(raOctet, 16) * 0.01;

    record["021_230_Roll Angle"] = ra;
}

/**
 * Data Item I021/250, Mode S MB Data
 * 항공기 트랜스폰더(송수신기)로부터 추출된 Mode S Comm B 데이터
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di250 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    for (let index = 0; index < octet1; index++) {
        const octet2 = bitArr[currentPos++];
        const octet3 = bitArr[currentPos++];
        const octet4 = bitArr[currentPos++];
        const octet5 = bitArr[currentPos++];
        const octet6 = bitArr[currentPos++];
        const octet7 = bitArr[currentPos++];
        const octet8 = bitArr[currentPos++];

        const mbOctet = 
        (octet2 << (8 * 6)) | (octet3 << (8 * 5)) | 
        (octet4 << (8 * 4)) | (octet5 << (8 * 3)) | 
        (octet6 << (8 * 2)) | (octet7 << 8) | octet8;

        record["021_230_MB DATA_" + (index + 1)] = mbOctet;

        const octet9 = bitArr[currentPos++];

        const bds1Octet = octetOfRange(octet9, 7, 4, 3);
        const bds2Octet = octetOfRange(octet9, 3, 0, 3);

        record["021_230_BDS1_" + (index + 1)] = bds1Octet;
        record["021_230_BDS2_" + (index + 1)] = bds2Octet;
    }
}

/**
 * Data Item I021/260, ACAS Resolution Advisory Report
 * RA 메시지 및 위협 식별 데이터를 송신하는 트랜스폰더와 연결된 ACAS가 생성한, 현재 활성화된 회피 지시(RA) 정보(있는 경우)
 * 고정 길이, 7 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di260 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    
    const typOctet = octetOfRange(octet1, 7, 3, 4);
    
    record["021_260_TYP"] = typOctet;
    
    const stypOctet = octetOfRange(octet1, 2, 0, 2);
    
    record["021_260_STYP"] = stypOctet;
    
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const araOctet = (octet2 << 6) | octetOfRange(octet3, 7, 2, 5);

    record["021_260_ARA"] = araOctet;

    const octet4 = bitArr[currentPos++];

    const racOctet = octetOfRange(octet3, 1, 0, 1) | octetOfRange(octet4, 7, 6, 1);

    record["021_260_RAC"] = racOctet;
    record["021_260_RAT"] = ((octet4 & (1 << 5)) != 0) ? 1 : 0;
    record["021_260_MTE"] = ((octet4 & (1 << 4)) != 0) ? 1 : 0;

    record["021_260_TTI"] = octetOfRange(octet4, 3, 2, 1);

    const tidFrontValue = octetOfRange(octet4, 1, 0, 1);
    const octet5 = bitArr[currentPos++];
    const octet6 = bitArr[currentPos++];
    const octet7 = bitArr[currentPos++];

    record["021_260_TID"] = (tidFrontValue << (8 * 3)) | (octet5 << (8 * 2)) | (octet6 << 8) | (octet7);
}

/**
 * Data Item I021/271, Surface Capabilities and Characteristics\
 * 지상 활주 중(지상에 있는 동안) 항공기의 운용 가능 능력
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di271 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 5)) === 0) {
        record["021_271_POA"] = "Position transmitted is not ADS-B position reference point (0)";
    } else {
        record["021_271_POA"] = "Position transmitted is ADS-B position reference point (1)";
    }

    if ((octet1 & (1 << 4)) === 0) {
        record["021_271_CDTI/S"] = "CDTI not operational (0)";
    } else {
        record["021_271_CDTI/S"] = "CDTI operational (1)";
    }

    if ((octet1 & (1 << 3)) === 0) {
        record["021_271_B2 low"] = ">= 70 Watts (0)";
    } else {
        record["021_271_B2 low"] = "< 70 Watts (1)";
    }

    if ((octet1 & (1 << 2)) === 0) {
        record["021_271_RAS"] = "Aircraft not receiving ATC-services (0)";
    } else {
        record["021_271_RAS"] = "Aircraft receiving ATC services (1)";
    }

    if ((octet1 & (1 << 1)) === 0) {
        record["021_271_IDENT"] = "IDENT switch not active (0)";
    } else {
        record["021_271_IDENT"] = "IDENT switch active (1)";
    }

    if ((octet1 & (1)) === 0) return;

    const octet2 = bitArr[currentPos++];

    const lwValue = octetOfRange(octet2, 7, 4, 3);

    record["021_271_LW"] = lwValue;
}

/**
 * Data Item I021/295, Data Ages
 * 제공된 데이터의 생성 경과 시간(데이터의 신선도)
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di295 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, currentPos);

    currentPos += headerLen;

    if (isBitSet(bits, 1, currentPos)) {
        // AOS
        const octet1 = bitArr[currentPos++];

        record["021_295_AOS"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 2, currentPos)) {
        // TRD
        const octet1 = bitArr[currentPos++];

        record["021_295_TRD"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 3, currentPos)) {
        // M3A
        const octet1 = bitArr[currentPos++];

        record["021_295_M3A"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 4, currentPos)) {
        // QI
        const octet1 = bitArr[currentPos++];

        record["021_295_QI"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 5, currentPos)) {
        // TI
        const octet1 = bitArr[currentPos++];

        record["021_295_TI"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 6, currentPos)) {
        // MAM
        const octet1 = bitArr[currentPos++];

        record["021_295_MAM"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 7, currentPos)) {
        // GH
        const octet1 = bitArr[currentPos++];

        record["021_295_GH"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 8, currentPos)) {
        // FL
        const octet1 = bitArr[currentPos++];

        record["021_295_FL"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 9, currentPos)) {
        // ISA
        const octet1 = bitArr[currentPos++];

        record["021_295_ISA"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 10, currentPos)) {
        // FSA
        const octet1 = bitArr[currentPos++];

        record["021_295_FSA"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 11, currentPos)) {
        // AS
        const octet1 = bitArr[currentPos++];

        record["021_295_AS"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 12, currentPos)) {
        // TAS
        const octet1 = bitArr[currentPos++];

        record["021_295_TAS"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 13, currentPos)) {
        // MH
        const octet1 = bitArr[currentPos++];

        record["021_295_MH"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 14, currentPos)) {
        // BVR
        const octet1 = bitArr[currentPos++];

        record["021_295_BVR"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 15, currentPos)) {
        // GVR
        const octet1 = bitArr[currentPos++];

        record["021_295_GVR"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 16, currentPos)) {
        // GV
        const octet1 = bitArr[currentPos++];

        record["021_295_GV"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 17, currentPos)) {
        // TAR
        const octet1 = bitArr[currentPos++];

        record["021_295_TAR"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 18, currentPos)) {
        // TI
        const octet1 = bitArr[currentPos++];

        record["021_295_TI"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 19, currentPos)) {
        // TS
        const octet1 = bitArr[currentPos++];

        record["021_295_TS"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 20, currentPos)) {
        // MET
        const octet1 = bitArr[currentPos++];

        record["021_295_MET"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 21, currentPos)) {
        // ROA
        const octet1 = bitArr[currentPos++];

        record["021_295_ROA"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 22, currentPos)) {
        // ARA
        const octet1 = bitArr[currentPos++];

        record["021_295_ARA"] = octet1 * 0.1;
    }

    if (isBitSet(bits, 23, currentPos)) {
        // SCC
        const octet1 = bitArr[currentPos++];

        record["021_295_SCC"] = octet1 * 0.1;
    }
}

/**
 * Data Item I021/400, Receiver ID
 * 분산 시스템 내 지상국 식별자(명칭)
 * 고정 길이, 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di400 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    record["021_400_RID"] = octet1;
}

/**
 * Data Item SP - 문서 상에 파싱 규칙 없음
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 * @param diLength 메모리 재할당 방지
 */
const sp = (record: Record, bitArr: Uint8Array, currentPos: number, diLength: number) => {
    record["021_SP"] = getHexString(bitArr, currentPos, diLength);
}

/**
 * Data Item RE - 문서 상에 파싱 규칙 없음
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 * @param diLength 데이터 길이
 */
const re = (record: Record, bitArr: Uint8Array, currentPos: number, diLength: number) => {
    record["021_RE"] = getHexString(bitArr, currentPos, diLength);
}

export { Record, cat021Process }