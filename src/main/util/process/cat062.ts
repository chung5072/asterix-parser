import { getChar, isBitSet, octetOfRange, twosCompliment } from "../common";
import { getHexString, parseIndicator } from "../preprocess";

type Record = {
    [dataItem: string]: {};
};

/**
 * CAT 062 파싱
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 * @param dataItem 데이터 아이템 이름
 * @param diLength 데이터 아이템 길이
 */
const cat062Process = (record: Record, bitArr: Uint8Array, currentPos: number, dataItem: string, diLength: number) => {
    switch (dataItem) {
        case "di010": {
            di010(record, bitArr, currentPos);
            break;
        }
        case "di015": {
            di015(record, bitArr, currentPos);
            break;
        }
        case "di040": {
            di040(record, bitArr, currentPos);
            break;
        }
        case "di060": {
            di060(record, bitArr, currentPos);
            break;
        }
        case "di070": {
            di070(record, bitArr, currentPos);
            break;
        }
        case "di080": {
            di080(record, bitArr, currentPos);
            break;
        }
        case "di100": {
            di100(record, bitArr, currentPos);
            break;
        }
        case "di105": {
            di105(record, bitArr, currentPos);
            break;
        }
        case "di110": {
            di110(record, bitArr, currentPos);
            break;
        }
        case "di120": {
            di120(record, bitArr, currentPos);
            break;
        }
        case "di130": {
            di130(record, bitArr, currentPos);
            break;
        }
        case "di135": {
            di135(record, bitArr, currentPos);
            break;
        }
        case "di136": {
            di136(record, bitArr, currentPos);
            break;
        }
        case "di185": {
            di185(record, bitArr, currentPos);
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
        case "di245": {
            di245(record, bitArr, currentPos);
            break;
        }
        case "di270": {
            di270(record, bitArr, currentPos);
            break;
        }
        case "di290": {
            di290(record, bitArr, currentPos);
            break;
        }
        case "di295": {
            di295(record, bitArr, currentPos);
            break;
        }
        case "di300": {
            di300(record, bitArr, currentPos);
            break;
        }
        case "di340": {
            di340(record, bitArr, currentPos);
            break;
        }
        case "di380": {
            di380(record, bitArr, currentPos);
            break;
        }
        case "di390": {
            di390(record, bitArr, currentPos);
            break;
        }
        case "di500": {
            di500(record, bitArr, currentPos);
            break;
        }
        case "di510": {
            di510(record, bitArr, currentPos);
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

    record["062_010_SAC"] = octet1;
    record["062_010_SIC"] = octet2;
}

/**
 * Data Item I062/015, Service Identification
 * Service Id를 반환
 * 고정 길이: 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di015 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    record["062_015_Service Identification"] = octet1;
}

/**
 * Data Item I062/040, Track Number
 * 항적 식별자 번호
 * 고정 길이: 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di040 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const tnOctet = (octet1 << 8) | (octet2);

    record["062_040_TRACK NUMBER"] = tnOctet;
}

/**
 * Data Item I062/060 - Track Mode 3/A Code
 * 상태 비트 + 트랜스폰더 코드 정보
 * 고정 길이: 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di060 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    // V
    if ((octet1 & (1 << 7)) === 0) {
        record["062_060_V"] = "Code validated (0)";
    } else {
        record["062_060_V"] = "Code not validated (1)";
    }

    // G
    if ((octet1 & (1 << 6)) === 0) {
        record["062_060_G"] = "Default (0)";
    } else {
        record["062_060_G"] = "Garbled Code (1)";
    }

    // CH
    if ((octet1 & (1 << 5)) === 0) {
        record["062_060_CH"] = "No Change (0)";
    } else {
        record["062_060_CH"] = "Mode 3/A has changed (1)";
    }

    const aStr = octetOfRange(octet1, 3, 1, 2).toString();
    const bStr = ((octetOfRange(octet1, 0, 0, 0) << 2) | octetOfRange(octet2, 7, 6, 1)).toString();
    const cStr = octetOfRange(octet2, 5, 3, 2).toString();
    const dStr = octetOfRange(octet2, 2, 0, 2).toString();

    record["062_060_Mode-3/A"] = aStr + bStr + cStr + dStr;
}

/**
 * Data Item I062/070, Time Of Track Information
 * Time Of Track Information를 반환
 * 고정 길이: 3 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di070 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const totiOctet = (octet1 << (8*2)) | (octet2 << 8) | (octet3);

    record["062_070_Time Of Track Information"] = totiOctet;
}

/**
 * Data Item I062/080, Track Status
 * 트랙의 상태
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di080 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    // MON
    if ((octet1 & (1 << 7)) === 0) {
        record["062_080_MON"] = "Multisensor track (0)";
    } else {
        record["062_080_MON"] = "Monosensor track (1)";
    }

    // SPI
    if ((octet1 & (1 << 6)) === 0) {
        record["062_080_SPI"] = "default value (0)";
    } else {
        record["062_080_SPI"] = "SPI present in the last report received from a sensor capable of decoding this data (1)";
    }

    // MRH
    if ((octet1 & (1 << 5)) === 0) {
        record["062_080_MRH"] = "Barometric altitude (Mode C) more reliable (0)";
    } else {
        record["062_080_MRH"] = "Geometric altitude more reliable (1)";
    }

    const sourceOctet = octetOfRange(octet1, 4, 2, 2);
    switch (sourceOctet) {
        case 0:
            record["062_080_SRC"] = "no source (0)";
            break;
        case 1:
            record["062_080_SRC"] = "GNSS (1)";
            break;
        case 2:
            record["062_080_SRC"] = "3D radar (2)";
            break;
        case 3:
            record["062_080_SRC"] = "triangulation (3)";
            break;
        case 4:
            record["062_080_SRC"] = "height from coverage (4)";
            break;
        case 5:
            record["062_080_SRC"] = "speed look-up table (5)";
            break;
        case 6:
            record["062_080_SRC"] = "default height (6)";
            break;
        case 7:
            record["062_080_SRC"] = "multilateration (7)";
            break;
        default:
            record["062_080_SRC"] = "UNDEFINED";
            break;
    }

    // CNF
    if ((octet1 & (1 << 1)) === 0) {
        record["062_080_CNF"] = "Confirmed track (0)";
    } else {
        record["062_080_CNF"] = "Tentative track (1)";
    }
    
    if ((octet1 & (1)) === 0) return;

    const octet2 = bitArr[currentPos++];

    // SIM
    if ((octet2 & (1 << 7)) === 0) {
        record["062_080_SIM"] = "Actual track (0)";
    } else {
        record["062_080_SIM"] = "Simulated track (1)";
    }

    // TSE
    if ((octet2 & (1 << 6)) === 0) {
        record["062_080_TSE"] = "default value (0)";
    } else {
        record["062_080_TSE"] = "last message transmitted to the user for the track (1)";
    }

    // TSB
    if ((octet2 & (1 << 5)) === 0) {
        record["062_080_TSB"] = "default value (0)";
    } else {
        record["062_080_TSB"] = "first message transmitted to the user for the track (1)";
    }

    // FPC
    if ((octet2 & (1 << 4)) === 0) {
        record["062_080_TSB"] = "Not flight-plan correlated (0)";
    } else {
        record["062_080_TSB"] = "Flight plan correlated (1)";
    }

    // AFF
    if ((octet2 & (1 << 3)) === 0) {
        record["062_080_AFF"] = "default value (0)";
    } else {
        record["062_080_AFF"] = "ADS-B data inconsistent with other surveillance information (1)";
    }

    // STP
    if ((octet2 & (1 << 2)) === 0) {
        record["062_080_STP"] = "default value (0)";
    } else {
        record["062_080_STP"] = "Slave Track Promotion (1)";
    }

    // KOS
    if ((octet2 & (1 << 1)) === 0) {
        record["062_080_KOS"] = "Complementary service used (0)";
    } else {
        record["062_080_KOS"] = "Background service used (1)";
    }

    if ((octet2 & (1)) === 0) return;

    const octet3 = bitArr[currentPos++];

    // AMA
    if ((octet3 & (1 << 7)) === 0) {
        record["062_080_AMA"] = "track not resulting from amalgamation process (0)";
    } else {
        record["062_080_AMA"] = "track resulting from amalgamation process (1)";
    }

    // MD4
    const md4Octet = octetOfRange(octet3, 6, 5, 1);
    switch (md4Octet) {
        case 0:
            record["062_080_MD4"] = "No Mode 4 interrogation (0)";
            break;
        case 1:
            record["062_080_MD4"] = "Friendly target (1)";
            break;
        case 2:
            record["062_080_MD4"] = "Unknown target (2)";
            break;
        case 3:
            record["062_080_MD4"] = "No reply (3)";
            break;
        default:
            record["062_080_MD4"] = "UNDEFINED";
            break;
    }

    // ME
    if ((octet3 & (1 << 4)) === 0) {
        record["062_080_ME"] = "default value (0)";
    } else {
        record["062_080_ME"] = "Military Emergency present in the last report received from a sensor capable of decoding this data (1)";
    }

    // MD5
    const md5Octet = octetOfRange(octet3, 2, 1, 1);
    switch (md5Octet) {
        case 0:
            record["062_080_MD5"] = "No Mode 5 interrogation (0)";
            break;
        case 1:
            record["062_080_MD5"] = "Friendly target (1)";
            break;
        case 2:
            record["062_080_MD5"] = "Unknown target (2)";
            break;
        case 3:
            record["062_080_MD5"] = "No reply (3)";
            break;
        default:
            record["062_080_MD5"] = "UNDEFINED";
            break;
    }

    if ((octet3 & (1)) === 0) return;

    const octet4 = bitArr[currentPos++];

    // CST
    if ((octet4 & (1 << 7)) === 0) {
        record["062_080_CST"] = "Default value (0)";
    } else {
        record["062_080_CST"] = "Age of the last received track update is higher than system dependent threshold (coasting) (1)";
    }

    // PSR
    if ((octet4 & (1 << 6)) === 0) {
        record["062_080_PSR"] = "Default value (0)";
    } else {
        record["062_080_PSR"] = "Age of the last received PSR track update is higher than system dependent threshold (1)";
    }

    // SSR
    if ((octet4 & (1 << 5)) === 0) {
        record["062_080_SSR"] = "Default value (0)";
    } else {
        record["062_080_SSR"] = "Age of the last received SSR track update is higher than system dependent threshold (1)";
    }

    // MDS
    if ((octet4 & (1 << 4)) === 0) {
        record["062_080_MDS"] = "Default value (0)";
    } else {
        record["062_080_MDS"] = "Age of the last received Mode S track update is higher than system dependent threshold (1)";
    }

    // ADS
    if ((octet4 & (1 << 3)) === 0) {
        record["062_080_ADS"] = "Default value (0)";
    } else {
        record["062_080_ADS"] = "Age of the last received ADS-B track update is higher than system dependent threshold (1)";
    }

    // SUC
    if ((octet4 & (1 << 2)) === 0) {
        record["062_080_SUC"] = "Default value (0)";
    } else {
        record["062_080_SUC"] = "Special Used Code (Mode A codes to be defined in the system to mark a track with special interest) (1)";
    }

    // AAC
    if ((octet4 & (1 << 1)) === 0) {
        record["062_080_AAC"] = "Default value (0)";
    } else {
        record["062_080_AAC"] = "Assigned Mode A Code Conflict (same discrete Mode A Code assigned to another track) (1)";
    }

    if ((octet4 & (1)) === 0) return;

    const octet5 = bitArr[currentPos++];

    // SDS
    const sdsOctet = octetOfRange(octet5, 7, 6, 1);
    switch (sdsOctet) {
        case 0:
            record["062_080_SDS"] = "Combined (0)";
            break;
        case 1:
            record["062_080_SDS"] = "Co-operative only (1)";
            break;
        case 2:
            record["062_080_SDS"] = "Non-Cooperative only (2)";
            break;
        case 3:
            record["062_080_SDS"] = "Not defined (3)";
            break;
        default:
            record["062_080_SDS"] = "UNDEFINED";
            break;
    }

    // EMS
    const emsOctet = octetOfRange(octet5, 5, 3, 2);
    switch (emsOctet) {
        case 0:
            record["062_080_EMS"] = "No emergency (0)";
            break;
        case 1:
            record["062_080_EMS"] = "General emergency (1)";
            break;
        case 2:
            record["062_080_EMS"] = "Lifeguard / medical (2)";
            break;
        case 3:
            record["062_080_EMS"] = "Minimum fuel (3)";
            break;
        case 4:
            record["062_080_EMS"] = "No communications (4)";
            break;
        case 5:
            record["062_080_EMS"] = "Unlawful interference (5)";
            break;
        case 6:
            record["062_080_EMS"] = "'Downed' Aircraft (6)";
            break;
        case 7:
            record["062_080_EMS"] = "Undefined (7)";
            break;
        default:
            record["062_080_EMS"] = "UNDEFINED";
            break;
    }

    // PFT
    if ((octet5 & (1 << 2)) === 0) {
        record["062_080_PFT"] = "No indication (0)";
    } else {
        record["062_080_PFT"] = "Potential False Track Indication (1)";
    }

    // FPLT
    if ((octet5 & (1 << 1)) === 0) {
        record["062_080_FPLT"] = "Default value (0)";
    } else {
        record["062_080_FPLT"] = "Track created / updated with FPL data (1)";
    }

    if ((octet5 & (1)) === 0) return;

    const octet6 = bitArr[currentPos++];

    // DUPT
    if ((octet6 & (1 << 7)) === 0) {
        record["062_080_DUPT"] = "Default value (0)";
    } else {
        record["062_080_DUPT"] = "Duplicate Mode 3/A Code (1)";
    }

    // DUPF
    if ((octet6 & (1 << 6)) === 0) {
        record["062_080_DUPF"] = "Default value (0)";
    } else {
        record["062_080_DUPF"] = "Duplicate Flight Plan (1)";
    }

    // DUPM
    if ((octet6 & (1 << 5)) === 0) {
        record["062_080_DUPM"] = "Default value (0)";
    } else {
        record["062_080_DUPM"] = "Duplicate Flight Plan due to manual correlation (1)";
    }

    // SFC
    if ((octet6 & (1 << 4)) === 0) {
        record["062_080_SFC"] = "Default value (0)";
    } else {
        record["062_080_SFC"] = "Surface target (1)";
    }

    // IDD
    if ((octet6 & (1 << 3)) === 0) {
        record["062_080_IDD"] = "No indication (0)";
    } else {
        record["062_080_IDD"] = "Duplicate Flight-ID (1)";
    }

    // IEC
    if ((octet6 & (1 << 2)) === 0) {
        record["062_080_IEC"] = "Default value (0)";
    } else {
        record["062_080_IEC"] = "Inconsistent Emergency Code (1)";
    }
}

/**
 * Data Item I062/100, Calculated Track Position. (Cartesian) 
 * 좌표 평면에서 보는 x 및 y 정보 반환
 * 고정 길이: 6 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di100 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];

    const xOctet = (octet1 << (8*2)) | (octet2 << 8) | (octet3);

    const x = twosCompliment(xOctet, 24) * 0.5;

    const octet4 = bitArr[currentPos++];
    const octet5 = bitArr[currentPos++];
    const octet6 = bitArr[currentPos++];

    const yOctet = (octet4 << (8*2)) | (octet5 << 8) | (octet6);

    const y = twosCompliment(yOctet, 24) * 0.5;

    record["062_100_X"] = x ;
    record["062_100_Y"] = y ;
}

/**
 * Data Item I062/105, Calculated Position In WGS-84 Co-ordinates
 * 위도 및 경도 정보 반환
 * 고정 길이: 8 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di105 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];
    const octet4 = bitArr[currentPos++];

    const latOctet = (octet1 << (8*3)) | (octet2 << (8*2)) | (octet3 << 8) | (octet4);

    const lat = twosCompliment(latOctet, 32) * 180.0 / (1 << 25);

    const octet5 = bitArr[currentPos++];
    const octet6 = bitArr[currentPos++];
    const octet7 = bitArr[currentPos++];
    const octet8 = bitArr[currentPos++];

    const lngOctet = (octet5 << (8*3)) | (octet6 << (8*2)) | (octet7 << 8) | (octet8);

    const lng = twosCompliment(lngOctet, 32) * 180.0 / (1 << 25);

    record["062_105_Latitude in WGS - 84"] = lat;
    record["062_100_Longitude in WGS - 84"] = lng;
}

/**
 * Data Item I062/110, Mode 5 Data reports & Extended Mode 1 Code
 * 군용 식별 코드 Mode 5, Mode 1 코드
 * 가변길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di110 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, currentPos);

    currentPos += headerLen;

    if (isBitSet(bits, 1, currentPos)) {
        // SUM
        const octet1 = bitArr[currentPos++];

        // M5
        if ((octet1 & (1 << 7)) === 0) {
            record["062_110_M5"] = "No Mode 5 interrogation (0)";
        } else {
            record["062_110_M5"] = "Mode 5 interrogation (1)";
        }

        // ID
        if ((octet1 & (1 << 6)) === 0) {
            record["062_110_ID"] = "No authenticated Mode 5 ID reply (0)";
        } else {
            record["062_110_ID"] = "Authenticated Mode 5 ID reply (1)";
        }

        // DA
        if ((octet1 & (1 << 5)) === 0) {
            record["062_110_DA"] = "No authenticated Mode 5 Data reply or Report (0)";
        } else {
            record["062_110_DA"] = "Authenticated Mode 5 Data reply or Report (i.e any valid Mode 5 reply type other than ID) (1)";
        }

        // M1
        if ((octet1 & (1 << 4)) === 0) {
            record["062_110_M1"] = "Mode 1 code not present or not from Mode 5 reply (0)";
        } else {
            record["062_110_M1"] = "Mode 1 code from Mode 5 reply (1)";
        }

        // M2
        if ((octet1 & (1 << 3)) === 0) {
            record["062_110_M2"] = "Mode 2 code not present or not from Mode 5 reply (0)";
        } else {
            record["062_110_M2"] = "Mode 2 code from Mode 5 reply (1)";
        }

        // M3
        if ((octet1 & (1 << 2)) === 0) {
            record["062_110_M3"] = "Mode 3 code not present or not from Mode 5 reply (0)";
        } else {
            record["062_110_M3"] = "Mode 3 code from Mode 5 reply (1)";
        }

        // MC
        if ((octet1 & (1 << 1)) === 0) {
            record["062_110_MC"] = "Mode C altitude not present or not from Mode 5 reply (0)";
        } else {
            record["062_110_MC"] = "Mode C altitude from Mode 5 reply (1)";
        }
    }

    if (isBitSet(bits, 2, currentPos)) {
        // PMN
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const pinOctet = (octetOfRange(octet1, 5, 0, 5) << 8) | (octet2);

        record["062_110_PIN"] = pinOctet;

        const octet3 = bitArr[currentPos++];

        record["062_110_NAT"] = octetOfRange(octet3, 4, 0, 4);

        const octet4 = bitArr[currentPos++];

        record["062_110_MIS"] = octetOfRange(octet4, 5, 0, 5);
    }

    if (isBitSet(bits, 3, currentPos)) {
        // POS
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];
        const octet3 = bitArr[currentPos++];

        const latOctet = (octet1 << (8*2)) | (octet2 << 8) | (octet3);

        const lat = twosCompliment(latOctet, 24) * 180.0 / (1 << 23);

        const octet4 = bitArr[currentPos++];
        const octet5 = bitArr[currentPos++];
        const octet6 = bitArr[currentPos++];

        const lngOctet = (octet4 << (8*2)) | (octet5 << 8) | (octet6);

        const lng = twosCompliment(lngOctet, 24) * 180.0 / (1 << 23);

        record["062_110_Latitude"] = lat;
        record["062_110_Longitude"] = lng;
    }

    if (isBitSet(bits, 4, currentPos)) {
        // GA
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 6)) === 0) {
            record["062_110_RES"] = "GA reported in 100 ft increments (0)";
        } else {
            record["062_110_RES"] = "GA reported in 25 ft increments (1)";
        }

        const octet2 = bitArr[currentPos++];

        const gaOctet = (octetOfRange(octet1, 5, 0, 5) << 8) | (octet2);

        record["062_110_GA"] = gaOctet;
    }

    if (isBitSet(bits, 5, currentPos)) {
        // EM1
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const aStr = octetOfRange(octet1, 3, 1, 2).toString();
        const bStr = ((octetOfRange(octet1, 0, 0, 0) << 2) | octetOfRange(octet2, 7, 6, 1)).toString();
        const cStr = octetOfRange(octet2, 5, 3, 2).toString();
        const dStr = octetOfRange(octet2, 2, 0, 2).toString();

        record["062_110_Mode-1"] = aStr + bStr + cStr + dStr;
    }

    if (isBitSet(bits, 6, currentPos)) {
        // TOS
        const octet1 = bitArr[currentPos++];

        const tos = twosCompliment(octet1, 8) * 1.0 / 128;

        record["062_110_TOS"] = tos;
    }

    if (isBitSet(bits, 7, currentPos)) {
        // XP
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 4)) === 0) {
            record["062_110_X5"] = "X-pulse set to zero or no authenticated Data reply or Report received (0)";
        } else {
            record["062_110_X5"] = "X-pulse set to one (present) (1)";
        }

        if ((octet1 & (1 << 3)) === 0) {
            record["062_110_XC"] = "X-pulse set to zero or no Mode C reply (0)";
        } else {
            record["062_110_XC"] = "X-pulse set to one (present) (1)";
        }

        if ((octet1 & (1 << 2)) === 0) {
            record["062_110_X3"] = "X-pulse set to zero or no Mode 3/A reply (0)";
        } else {
            record["062_110_X3"] = "X-pulse set to one (present) (1)";
        }

        if ((octet1 & (1 << 1)) === 0) {
            record["062_110_X2"] = "X-pulse set to zero or no Mode 2 reply (0)";
        } else {
            record["062_110_X2"] = "X-pulse set to one (present) (1)";
        }

        if ((octet1 & (1 << 0)) === 0) {
            record["062_110_X1"] = "X-pulse set to zero or no Mode 1 reply (0)";
        } else {
            record["062_110_X1"] = "X-pulse set to one (present) (1)";
        }
    }
}

/**
 * Data Item I062/120, Track Mode 2 Code
 * 군용 식별 코드 Mode 2
 * 4자리 8진수 단위 코드 제공(전투기의 경우 지상에서 설정, 수송기의 경우 비행 중 변경 가능)
 * 고정 길이: 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di120 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    // EM1
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const aStr = octetOfRange(octet1, 3, 1, 2).toString();
    const bStr = ((octetOfRange(octet1, 0, 0, 0) << 2) | octetOfRange(octet2, 7, 6, 1)).toString();
    const cStr = octetOfRange(octet2, 5, 3, 2).toString();
    const dStr = octetOfRange(octet2, 2, 0, 2).toString();

    record["062_120_Mode-2"] = aStr + bStr + cStr + dStr;
}

/**
 * Data Item I062/130, Calculated Track Geometric Altitude
 * 고도 - 대상과 WGS84 투영체 사이의 수직 거리
 * 2의 보수 
 * 고정 길이: 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di130 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const altOctet = (octet1 << 8) | (octet2);

    const alt = twosCompliment(altOctet, 16) * 6.25;

    record["062_130_Altitude"] = alt;
}

/**
 * Data Item I062/135, Calculated Track Barometric Altitude
 * 트랙의 기압 고도
 * 2의 보수 
 * 고정 길이: 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di135 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    if ((octet1 & (1 << 7)) === 0) {
        record["062_135_QNH"] = "No QNH correction applied (0)";
    } else {
        record["062_135_QNH"] = "QNH correction applied (1)";
    }

    const octet2 = bitArr[currentPos++];

    const baroAltOctet = (octetOfRange(octet1, 6, 0, 6) << 8) | octet2;

    const baroAlt = twosCompliment(baroAltOctet, 15) * 0.25;

    record["062_135_Calculated Track Barometric Altitude"] = baroAlt;
}

/**
 * Data Item I062/136, Measured Flight Level
 * 비행 레벨
 * 2의 보수
 * 고정 길이: 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di136 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const flOctet = (octet1 << 8) | octet2;

    const fl = twosCompliment(flOctet, 16) * 0.25;

    record["062_136_Measured Flight Level"] = fl;
}

/**
 * Data Item I062/185, Calculated Track Velocity (Cartesian)
 * 좌표 평면에서 보는 속도에 대해 x 및 y 정보 반환
 * 2의 보수
 * 고정 길이: 4 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di185 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const vxOctet = (octet1 << 8) | octet2;

    const vx = twosCompliment(vxOctet, 16) * 0.25;

    record["062_136_Vx"] = vx;

    const octet3 = bitArr[currentPos++];
    const octet4 = bitArr[currentPos++];

    const vyOctet = (octet3 << 8) | octet4;
    
    const vy = twosCompliment(vyOctet, 16) * 0.25;

    record["062_136_Vy"] = vy;
}

/**
 * Data Item I062/200, Mode of Movement
 * 항적 식별자 번호
 * 고정 길이: 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di200 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const transOctet = octetOfRange(octet1, 7, 6, 1);
    switch (transOctet) {
        case 0:
            record["062_200_TRANS"] = "Constant Course (0)";
            break;
        case 1:
            record["062_200_TRANS"] = "Right Turn (1)";
            break;
        case 2:
            record["062_200_TRANS"] = "Left Turn (2)";
            break;
        case 3:
            record["062_200_TRANS"] = "Undetermined (3)";
            break;
        default:
            record["062_200_TRANS"] = "UNDEFINED";
            break;
    }

    const longOctet = octetOfRange(octet1, 5, 4, 1);
    switch (longOctet) {
        case 0:
            record["062_200_LONG"] = "Constant Groundspeed (0)";
            break;
        case 1:
            record["062_200_LONG"] = "Increasing Groundspeed (1)";
            break;
        case 2:
            record["062_200_LONG"] = "Decreasing Groundspeed (2)";
            break;
        case 3:
            record["062_200_LONG"] = "Undetermined (3)";
            break;
        default:
            record["062_200_LONG"] = "UNDEFINED";
            break;
    }
    
    const vertOctet = octetOfRange(octet1, 3, 2, 1);
    switch (vertOctet) {
        case 0:
            record["062_200_VERT"] = "Level (0)";
            break;
        case 1:
            record["062_200_VERT"] = "Climb (1)";
            break;
        case 2:
            record["062_200_VERT"] = "Descent (2)";
            break;
        case 3:
            record["062_200_VERT"] = "Undetermined (3)";
            break;
        default:
            record["062_200_VERT"] = "UNDEFINED";
            break;
    }

    if ((octet1 & (1 << 1)) === 0) {
        record["062_200_ADF"] = "No altitude discrepancy (0)";
    } else {
        record["062_200_ADF"] = "Altitude discrepancy (1)";
    }
}

/**
 * Data Item I062/210, Calculated Acceleration (Cartesian)
 * 좌표평면으로 표시한 타겟의 가속도를 2의 보수 형식으로 계산한 것
 * 고정 길이: 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di210 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const ax = twosCompliment(octet1, 8) * 0.25;

    record["062_210_Ax"] = ax;

    const octet2 = bitArr[currentPos++];

    const ay = twosCompliment(octet2, 8) * 0.25;

    record["062_210_Ay"] = ay;
}

/**
 * Data Item I062/220,  Calculated Rate Of Climb/Descent 
 * 항공기의 상승 및 하강 속도를 계산
 * 고정 길이: 2 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di220 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];
    const octet2 = bitArr[currentPos++];

    const rcdOctet = (octet1 << 8) | octet2;

    const rcd = twosCompliment(rcdOctet, 16) * 6.25;

    record["062_220_Rate of Climb/Descent"] = rcd;
}

/**
 * Data Item I062/245, Target Identification
 * 항공기 식별 콜사인 코드(ex. KAL123)
 * 고정 길이: 7 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di245 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const stiOctet = octetOfRange(octet1, 7, 6, 1);
    switch (stiOctet) {
        case 0:
            record["062_245_STI"] = "Callsign or registration downlinked from target (0)";
            break;
        case 1:
            record["062_245_STI"] = "Callsign not downlinked from target (1)";
            break;
        case 2:
            record["062_245_STI"] = "Registration not downlinked from target (2)";
            break;
        case 3:
            record["062_245_STI"] = "Invalid (3)";
            break;
        default:
            record["062_245_STI"] = "UNDEFINED";
            break;
    }

    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];
    const octet4 = bitArr[currentPos++];

    const char1Octet = octetOfRange(octet2, 7, 2, 5);
    const char2Octet = (octetOfRange(octet2, 1, 0, 1) << 4) | octetOfRange(octet3, 7, 4, 3);
    const char3Octet = (octetOfRange(octet3, 3, 0, 3) << 2) | octetOfRange(octet4, 7, 6, 1);
    const char4Octet = octetOfRange(octet4, 5, 0, 5);

    const octet5 = bitArr[currentPos++];
    const octet6 = bitArr[currentPos++];
    const octet7 = bitArr[currentPos++];

    const char5Octet = octetOfRange(octet5, 7, 2, 5);
    const char6Octet = (octetOfRange(octet5, 1, 0, 1) << 4) | octetOfRange(octet6, 7, 4, 3);
    const char7Octet = (octetOfRange(octet6, 3, 0, 3) << 2) | octetOfRange(octet7, 7, 6, 1);
    const char8Octet = octetOfRange(octet7, 5, 0, 5);

    const convertedChars = [
        char1Octet, char2Octet, char3Octet, char4Octet,
        char5Octet, char6Octet, char7Octet, char8Octet
    ].map(code => getChar(code)) // 숫자를 문자로 변환
    .filter(char => char !== "") // 빈 문자열("") 제거 
    .join("");                   // 하나의 문자열로 합치기 

    record["062_245_Target Identification"] = convertedChars;
}

/**
 * Data Item I062/270, Target Size & Orientation
 * 감지된 타겟의 크기
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di270 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    const lenOctet = octet1;

    record["062_270_LENGTH"] = (lenOctet >> 1);

    if ((octet1 & (1)) === 0) return;

    const octet2 = bitArr[currentPos++];

    const orientOctet = octet2;

    record["062_270_ORIENTATION"] = (orientOctet >> 1);

    if ((octet2 & (1)) === 0) return;

    const octet3 = bitArr[currentPos++];

    record["062_270_WIDTH"] = (octet3 >> 1);
}

/**
 * Data Item I062/290, System Track Update Ages
 * 센서 유형에 대한 보고서 업데이트 기간
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di290 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, currentPos);

    currentPos += headerLen;

    if (isBitSet(bits, 1, currentPos)) {
        // TRK
        const octet1 = bitArr[currentPos++];

        const trk = octet1 * 0.25;

        record["062_290_TRK"] = trk;
    }

    if (isBitSet(bits, 2, currentPos)) {
        // PSR
        const octet1 = bitArr[currentPos++];

        const psr = octet1 * 0.25;

        record["062_290_PSR"] = psr;
    }

    if (isBitSet(bits, 3, currentPos)) {
        // SSR
        const octet1 = bitArr[currentPos++];

        const ssr = octet1 * 0.25;

        record["062_290_SSR"] = ssr;
    }

    if (isBitSet(bits, 4, currentPos)) {
        // MDS
        const octet1 = bitArr[currentPos++];

        const mds = octet1 * 0.25;

        record["062_290_MDS"] = mds;
    }

    if (isBitSet(bits, 5, currentPos)) {
        // ADS
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const ads = ((octet1 << 8) | octet2) * 0.25;

        record["062_290_ADS"] = ads;
    }

    if (isBitSet(bits, 6, currentPos)) {
        // ES
        const octet1 = bitArr[currentPos++];

        const es = octet1 * 0.25;

        record["062_290_ES"] = es;
    }

    if (isBitSet(bits, 7, currentPos)) {
        // VDL
        const octet1 = bitArr[currentPos++];

        const vdl = octet1 * 0.25;

        record["062_290_VDL"] = vdl;
    }

    if (isBitSet(bits, 8, currentPos)) {
        // UAT
        const octet1 = bitArr[currentPos++];

        const uat = octet1 * 0.25;

        record["062_290_UAT"] = uat;
    }

    if (isBitSet(bits, 9, currentPos)) {
        // LOP
        const octet1 = bitArr[currentPos++];

        const lop = octet1 * 0.25;

        record["062_290_LOP"] = lop;
    }

    if (isBitSet(bits, 10, currentPos)) {
        // MLT
        const octet1 = bitArr[currentPos++];

        const mlt = octet1 * 0.25;

        record["062_290_MLT"] = mlt;
    }
}

/**
 * Data Item I062/295,  Track Data Ages
 * 각 데이터 항목이 최신 상태로부터 얼마나 시간이 지났는지(갱신된 지 얼마나 되었는지)
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di295 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, currentPos);

    currentPos += headerLen;

    if (isBitSet(bits, 1, currentPos)) {
        // MFL
        const octet1 = bitArr[currentPos++];

        const mfl = octet1 * 0.25;

        record["062_295_MFL"] = mfl;
    }

    if (isBitSet(bits, 2, currentPos)) {
        // MD1
        const octet1 = bitArr[currentPos++];

        const md1 = octet1 * 0.25;

        record["062_295_MD1"] = md1;
    }

    if (isBitSet(bits, 3, currentPos)) {
        // MD2
        const octet1 = bitArr[currentPos++];

        const md2 = octet1 * 0.25;

        record["062_295_MD2"] = md2;
    }

    if (isBitSet(bits, 4, currentPos)) {
        // MDA
        const octet1 = bitArr[currentPos++];

        const mda = octet1 * 0.25;

        record["062_295_MDA"] = mda;
    }

    if (isBitSet(bits, 5, currentPos)) {
        // MD4
        const octet1 = bitArr[currentPos++];

        const md4 = octet1 * 0.25;

        record["062_295_MD4"] = md4;
    }

    if (isBitSet(bits, 6, currentPos)) {
        // MD5
        const octet1 = bitArr[currentPos++];

        const md5 = octet1 * 0.25;

        record["062_295_MD5"] = md5;
    }

    if (isBitSet(bits, 7, currentPos)) {
        // MHG
        const octet1 = bitArr[currentPos++];

        const mhg = octet1 * 0.25;

        record["062_295_MHG"] = mhg;
    }

    if (isBitSet(bits, 8, currentPos)) {
        // IAS
        const octet1 = bitArr[currentPos++];

        const ias = octet1 * 0.25;

        record["062_295_IAS"] = ias;
    }

    if (isBitSet(bits, 9, currentPos)) {
        // TAS
        const octet1 = bitArr[currentPos++];

        const tas = octet1 * 0.25;

        record["062_295_TAS"] = tas;
    }

    if (isBitSet(bits, 10, currentPos)) {
        // SAL
        const octet1 = bitArr[currentPos++];

        const sal = octet1 * 0.25;

        record["062_295_SAL"] = sal;
    }

    if (isBitSet(bits, 11, currentPos)) {
        // FSS
        const octet1 = bitArr[currentPos++];

        const fss = octet1 * 0.25;

        record["062_295_FSS"] = fss;
    }

    if (isBitSet(bits, 12, currentPos)) {
        // TID
        const octet1 = bitArr[currentPos++];

        const tid = octet1 * 0.25;

        record["062_295_TID"] = tid;
    }

    if (isBitSet(bits, 13, currentPos)) {
        // COM
        const octet1 = bitArr[currentPos++];

        const com = octet1 * 0.25;

        record["062_295_COM"] = com;
    }

    if (isBitSet(bits, 14, currentPos)) {
        // SAB
        const octet1 = bitArr[currentPos++];

        const sab = octet1 * 0.25;

        record["062_295_SAB"] = sab;
    }

    if (isBitSet(bits, 15, currentPos)) {
        // ACS
        const octet1 = bitArr[currentPos++];

        const acs = octet1 * 0.25;

        record["062_295_ACS"] = acs;
    }

    if (isBitSet(bits, 16, currentPos)) {
        // BVR
        const octet1 = bitArr[currentPos++];

        const bvr = octet1 * 0.25;

        record["062_295_BVR"] = bvr;
    }

    if (isBitSet(bits, 17, currentPos)) {
        // GVR
        const octet1 = bitArr[currentPos++];

        const gvr = octet1 * 0.25;

        record["062_295_GVR"] = gvr;
    }

    if (isBitSet(bits, 18, currentPos)) {
        // RAN
        const octet1 = bitArr[currentPos++];

        const ran = octet1 * 0.25;

        record["062_295_RAN"] = ran;
    }

    if (isBitSet(bits, 19, currentPos)) {
        // TAR
        const octet1 = bitArr[currentPos++];

        const tar = octet1 * 0.25;

        record["062_295_TAR"] = tar;
    }

    if (isBitSet(bits, 20, currentPos)) {
        // TAN
        const octet1 = bitArr[currentPos++];

        const tan = octet1 * 0.25;

        record["062_295_TAN"] = tan;
    }

    if (isBitSet(bits, 21, currentPos)) {
        // GSP
        const octet1 = bitArr[currentPos++];

        const gsp = octet1 * 0.25;

        record["062_295_GSP"] = gsp;
    }

    if (isBitSet(bits, 22, currentPos)) {
        // VUN
        const octet1 = bitArr[currentPos++];

        const vun = octet1 * 0.25;

        record["062_295_VUN"] = vun;
    }

    if (isBitSet(bits, 23, currentPos)) {
        // MET
        const octet1 = bitArr[currentPos++];

        const met = octet1 * 0.25;

        record["062_295_MET"] = met;
    }

    if (isBitSet(bits, 24, currentPos)) {
        // EMC
        const octet1 = bitArr[currentPos++];

        const emc = octet1 * 0.25;

        record["062_295_EMC"] = emc;
    }

    if (isBitSet(bits, 25, currentPos)) {
        // POS
        const octet1 = bitArr[currentPos++];

        const pos = octet1 * 0.25;

        record["062_295_POS"] = pos;
    }

    if (isBitSet(bits, 26, currentPos)) {
        // GAL
        const octet1 = bitArr[currentPos++];

        const gal = octet1 * 0.25;

        record["062_295_GAL"] = gal;
    }

    if (isBitSet(bits, 27, currentPos)) {
        // PUN
        const octet1 = bitArr[currentPos++];

        const pun = octet1 * 0.25;

        record["062_295_PUN"] = pun;
    }

    if (isBitSet(bits, 28, currentPos)) {
        // MB
        const octet1 = bitArr[currentPos++];

        const mb = octet1 * 0.25;

        record["062_295_MB"] = mb;
    }

    if (isBitSet(bits, 29, currentPos)) {
        // IAR
        const octet1 = bitArr[currentPos++];

        const iar = octet1 * 0.25;

        record["062_295_IAR"] = iar;
    }

    if (isBitSet(bits, 30, currentPos)) {
        // MAC
        const octet1 = bitArr[currentPos++];

        const mac = octet1 * 0.25;

        record["062_295_MAC"] = mac;
    }

    if (isBitSet(bits, 31, currentPos)) {
        // BPS
        const octet1 = bitArr[currentPos++];

        const bps = octet1 * 0.25;

        record["062_295_BPS"] = bps;
    }
}

/**
 * Data Item I062/300, Vehicle Fleet Identification
 * 차량 식별 번호
 * 고정 길이: 1 octet
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di300 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    switch (octet1) {
        case 0:
            record["062_300_VFI"] = "Unknown (0)";
            break;
        case 1:
            record["062_300_VFI"] = "ATC equipment maintenance (1)";
            break;
        case 2:
            record["062_300_VFI"] = "Airport maintenance (2)";
            break;
        case 3:
            record["062_300_VFI"] = "Fire (3)";
            break;
        case 4:
            record["062_300_VFI"] = "Bird scarer (4)";
            break;
        case 5:
            record["062_300_VFI"] = "Snow plough (5)";
            break;
        case 6:
            record["062_300_VFI"] = "Runway sweeper (6)";
            break;
        case 7:
            record["062_300_VFI"] = "Emergency (7)";
            break;
        case 8:
            record["062_300_VFI"] = "Police (8)";
            break;
        case 9:
            record["062_300_VFI"] = "Bus (9)";
            break;
        case 10:
            record["062_300_VFI"] = "Tug (push/tow) (10)";
            break;
        case 11:
            record["062_300_VFI"] = "Grass cutter (11)";
            break;
        case 12:
            record["062_300_VFI"] = "Fuel (12)";
            break;
        case 13:
            record["062_300_VFI"] = "Baggage (13)";
            break;
        case 14:
            record["062_300_VFI"] = "Catering (14)";
            break;
        case 15:
            record["062_300_VFI"] = "Aircraft maintenance (15)";
            break;
        case 16:
            record["062_300_VFI"] = "Flyco (follow me) (16)";
            break;
        default:
            record["062_300_VFI"] = "UNDEFINED";
            break;
    }
}

/**
 * Data Item I062/340,  Measured Information
 * 트랙 업데이트에 사용된 마지막 보고서와 관련된 모든 측정 데이터
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di340 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, currentPos);

    currentPos += headerLen;

    if (isBitSet(bits, 1, currentPos)) {
        // SID
        const octet1 = bitArr[currentPos++];

        record["062_340_SAC"] = octet1;

        const octet2 = bitArr[currentPos++];

        record["062_340_SIC"] = octet2;
    }

    if (isBitSet(bits, 2, currentPos)) {
        // POS
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const rhoOctet = (octet1 << 8) | octet2;

        const rho = rhoOctet / 256;

        record["062_340_RHO"] = rho;

        const octet3 = bitArr[currentPos++];
        const octet4 = bitArr[currentPos++];

        const thetaOctet = (octet3 << 8) | octet4;

        const theta = (thetaOctet * 360.0) / (1 << 16);

        record["062_340_THETA"] = theta;
    }
    
    if (isBitSet(bits, 3, currentPos)) {
        // HEI
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const heightOctet = (octet1 << 8) | octet2;

        const height = heightOctet * 25;

        record["062_340_HEI"] = height;
    }
    
    if (isBitSet(bits, 4, currentPos)) {
        // MDC
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 7)) === 0) {
            record["062_340_V"] = "Code validated (0)";
        } else {
            record["062_340_V"] = "Code not validated (1)";
        }

        if ((octet1 & (1 << 6)) === 0) {
            record["062_340_G"] = "Default (0)";
        } else {
            record["062_340_G"] = "Garbled code (1)";
        }

        const octet2 = bitArr[currentPos++];

        const modeCOctet = (octetOfRange(octet1, 5, 0, 5) << 8) | octet2;

        const modeC = twosCompliment(modeCOctet, 14) * 0.25;

        record["062_340_Last Measured Mode C Code"] = modeC;
    }

    if (isBitSet(bits, 5, currentPos)) {
        // MDA
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 7)) === 0) {
            record["062_340_V"] = "Code validated (0)";
        } else {
            record["062_340_V"] = "Code not validated (1)";
        }

        if ((octet1 & (1 << 6)) === 0) {
            record["062_340_G"] = "Default (0)";
        } else {
            record["062_340_G"] = "Garbled code (1)";
        }

        if ((octet1 & (1 << 5)) === 0) {
            record["062_340_L"] = "MODE 3/A code as derived from the reply of the transponder (0)";
        } else {
            record["062_340_L"] = "Smoothed MODE 3/A code as provided by a sensor local tracker (1)";
        }

        const octet2 = bitArr[currentPos++];

        const aStr = octetOfRange(octet1, 3, 1, 2).toString();
        const bStr = ((octetOfRange(octet1, 0, 0, 0) << 2) | octetOfRange(octet2, 7, 6, 1)).toString();
        const cStr = octetOfRange(octet2, 5, 3, 2).toString();
        const dStr = octetOfRange(octet2, 2, 0, 2).toString();

        record["062_340_Last Measured Mode 3/A Code"] = aStr + bStr + cStr + dStr;
    }

    if (isBitSet(bits, 6, currentPos)) {
        // TYP
        const octet1 = bitArr[currentPos++];

        const typOctet = octetOfRange(octet1, 7, 5, 2);

        switch (typOctet) {
            case 0:
                record["062_340_TYP"] = "No detection (0)";
                break;
            case 1:
                record["062_340_TYP"] = "Single PSR detection (1)";
                break;
            case 2:
                record["062_340_TYP"] = "Single SSR detection (2)";
                break;
            case 3:
                record["062_340_TYP"] = "SSR + PSR detection (3)";
                break;
            case 4:
                record["062_340_TYP"] = "Single ModeS All-Call (4)";
                break;
            case 5:
                record["062_340_TYP"] = "Single ModeS Roll-Call (5)";
                break;
            case 6:
                record["062_340_TYP"] = "ModeS All-Call + PSR (6)";
                break;
            case 7:
                record["062_340_TYP"] = "ModeS Roll-Call + PSR (7)";
                break;
            default:
                record["062_340_TYP"] = "UNDEFINED";
                break;
        }

        if ((octet1 & (1 << 4)) === 0) {
            record["062_340_SIM"] = "Actual target report (0)";
        } else {
            record["062_340_SIM"] = "Simulated target report (1)";
        }

        if ((octet1 & (1 << 3)) === 0) {
            record["062_340_RAB"] = "Report from target transponder (0)";
        } else {
            record["062_340_RAB"] = "Report from field monitor (fixed transponder) (1)";
        }

        if ((octet1 & (1 << 2)) === 0) {
            record["062_340_TST"] = "Real target report (0)";
        } else {
            record["062_340_TST"] = "Test target report (1)";
        }
    }
}

/**
 * Data Item I062/380, Aircraft Derived Data
 * 항공기에서 직접 도출한 데이터
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di380 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, currentPos);

    currentPos += headerLen;

    if (isBitSet(bits, 1, currentPos)) {
        // ADR
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];
        const octet3 = bitArr[currentPos++];

        record["062_380_Target Address"] = (octet1 << (8*2)) | (octet2 << 8) | octet3;
    }

    if (isBitSet(bits, 2, currentPos)) {
        // ID
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];
        const octet3 = bitArr[currentPos++];
        
        const char1Octet = octetOfRange(octet1, 7, 2, 5);
        const char2Octet = (octetOfRange(octet2, 1, 0, 1) << 4) | octetOfRange(octet2, 7, 4, 3);
        const char3Octet = (octetOfRange(octet2, 3, 0, 3) << 2) | octetOfRange(octet3, 7, 6, 1);
        const char4Octet = octetOfRange(octet3, 5, 0, 5);
        
        const octet4 = bitArr[currentPos++];
        const octet5 = bitArr[currentPos++];
        const octet6 = bitArr[currentPos++];

        const char5Octet = octetOfRange(octet4, 7, 2, 5);
        const char6Octet = (octetOfRange(octet4, 1, 0, 1) << 4) | octetOfRange(octet5, 7, 4, 3);
        const char7Octet = (octetOfRange(octet5, 3, 0, 3) << 2) | octetOfRange(octet6, 7, 6, 1);
        const char8Octet = octetOfRange(octet6, 5, 0, 5);

        const convertedChars = [
            char1Octet, char2Octet, char3Octet, char4Octet,
            char5Octet, char6Octet, char7Octet, char8Octet
        ].map(code => getChar(code)) // 숫자를 문자로 변환
        .filter(char => char !== "") // 빈 문자열("") 제거 
        .join("");                   // 하나의 문자열로 합치기 

        record["062_380_Target Identification"] = convertedChars;
    }

    if (isBitSet(bits, 3, currentPos)) {
        // MHG
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const mhOctet = (octet1 << 8) | octet2;

        const mh = (mhOctet * 360.0) / (1 << 16);

        record["062_380_Magnetic Heading"] = mh;
    }

    if (isBitSet(bits, 4, currentPos)) {
        // IAS
        const octet1 = bitArr[currentPos++];

        const asFrontOctet = octetOfRange(octet1, 6, 0, 6);

        const octet2 = bitArr[currentPos++];

        const asOctet = (asFrontOctet << 8) | octet2;

        if ((octet1 & (1 << 7)) === 0) {
            record["062_380_IM"] = "Air Speed = IAS (0)";
            record["062_380_Air Speed"] = asOctet / (1 << 14);
        } else {
            record["062_380_IM"] = "Air Speed = Mach (1)";
            record["062_380_Air Speed"] = asOctet * 0.001;
        }
    }

    if (isBitSet(bits, 5, currentPos)) {
        // TAS
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const tasOctet = (octet1 << 8) | octet2;

        record["062_380_True Air Speed"] = tasOctet;
    }

    if (isBitSet(bits, 6, currentPos)) {
        // SAL
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 7)) === 0) {
            record["062_380_SAS"] = "No source information provided (0)";
        } else {
            record["062_380_SAS"] = "Source Information provided (1)";
        }

        const typOctet = octetOfRange(octet1, 6, 5, 1);

        switch (typOctet) {
            case 0:
                record["062_380_Source"] = "Unknown (0)";
                break;
            case 1:
                record["062_380_Source"] = "Aircraft Altitude (1)";
                break;
            case 2:
                record["062_380_Source"] = "FCU/MCP Selected Altitude (2)";
                break;
            case 3:
                record["062_380_Source"] = "FMS Selected Altitude (3)";
                break;
            default:
                record["062_380_Source"] = "UNDEFINED";
                break;
        }

        const altFrontOctet = octetOfRange(octet1, 4, 0, 4);
        const octet2 = bitArr[currentPos++];

        const altOctet = (altFrontOctet << 8) | octet2;

        const alt = twosCompliment(altOctet, 13) * 25;

        record["062_380_Selected Altitude"] = alt;
    }

    if (isBitSet(bits, 7, currentPos)) {
        // FSS
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 7)) === 0) {
            record["062_380_MV"] = "Not active (0)";
        } else {
            record["062_380_MV"] = "Active (1)";
        }

        if ((octet1 & (1 << 6)) === 0) {
            record["062_380_AH"] = "Not active (0)";
        } else {
            record["062_380_AH"] = "Active (1)";
        }

        if ((octet1 & (1 << 5)) === 0) {
            record["062_380_AM"] = "Not active (0)";
        } else {
            record["062_380_AM"] = "Active (1)";
        }

        const altFrontOctet = octetOfRange(octet1, 4, 0, 4);
        const octet2 = bitArr[currentPos++];

        const altOctet = (altFrontOctet << 8) | octet2;

        const alt = twosCompliment(altOctet, 13) * 25;

        record["062_380_Final State Selected Altitude"] = alt;
    }

    if (isBitSet(bits, 8, currentPos)) {
        // TIS
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 7)) === 0) {
            record["062_380_NAV"] = "Trajectory Intent Data is available for this aircraft (0)";
        } else {
            record["062_380_NAV"] = "Trajectory Intent Data is not available for this aircraft (1)";
        }

        if ((octet1 & (1 << 6)) === 0) {
            record["062_380_NVB"] = "Trajectory Intent Data is valid (0)";
        } else {
            record["062_380_NVB"] = "Trajectory Intent Data is not valid (1)";
        }
    }

    if (isBitSet(bits, 9, currentPos)) {
        // TID
        const octet1 = bitArr[currentPos++];

        for (let index = 0; index < octet1; index++) {
            const octet2 = bitArr[currentPos++];

            if ((octet2 & (1 << 7)) === 0) {
                record["062_380_TCA_" + (index + 1)] = "TCP number available (0)";
            } else {
                record["062_380_TCA_" + (index + 1)] = "TCP number not available (1)";
            }

            if ((octet2 & (1 << 6)) === 0) {
                record["062_380_NC_" + (index + 1)] = "TCP compliance (0)";
            } else {
                record["062_380_NC_" + (index + 1)] = "TCP non-compliance (1)";
            }

            const tcpNumOctet = octetOfRange(octet1, 5, 0, 5);

            record["062_380_TCP number_" + (index + 1)] = tcpNumOctet;

            const octet3 = bitArr[currentPos++];
            const octet4 = bitArr[currentPos++];

            const altOctet = (octet3 << 8) | octet4;

            const alt = twosCompliment(altOctet, 16) * 10;

            record["062_380_Altitude_" + (index + 1)] = alt;

            const octet5 = bitArr[currentPos++];
            const octet6 = bitArr[currentPos++];
            const octet7 = bitArr[currentPos++];

            const latOctet = (octet5 << (8*2)) | (octet6 << 8) | octet7;

            const lat = (twosCompliment(latOctet, 24) * 180.0) / (1 << 23);

            record["062_380_Latitude in WGS - 84_" + (index + 1)] = lat;

            const octet8 = bitArr[currentPos++];
            const octet9 = bitArr[currentPos++];
            const octet10 = bitArr[currentPos++];

            const lngOctet = (octet8 << (8*2)) | (octet9 << 8) | octet10;

            const lng = (twosCompliment(lngOctet, 24) * 180.0) / (1 << 23);

            record["062_380_Longitude in WGS - 84_" + (index + 1)] = lng;

            const octet11 = bitArr[currentPos++];

            const ptOctet = octetOfRange(octet11, 7, 4, 3);
            switch (ptOctet) {
                case 0:
                    record["062_380_Point Type_" + (index + 1)] = "Unknown (0)";
                    break;
                case 1:
                    record["062_380_Point Type_" + (index + 1)] = "Fly by waypoint (LT) (1)";
                    break;
                case 2:
                    record["062_380_Point Type_" + (index + 1)] = "Fly over waypoint (LT) (2)";
                    break;
                case 3:
                    record["062_380_Point Type_" + (index + 1)] = "Hold pattern (LT) (3)";
                    break;
                case 4:
                    record["062_380_Point Type_" + (index + 1)] = "Procedure hold (LT) (4)";
                    break;
                case 5:
                    record["062_380_Point Type_" + (index + 1)] = "Procedure turn (LT) (5)";
                    break;
                case 6:
                    record["062_380_Point Type_" + (index + 1)] = "RF leg (LT) (6)";
                    break;
                case 7:
                    record["062_380_Point Type_" + (index + 1)] = "Top of climb (VT) (7)";
                    break;
                case 8:
                    record["062_380_Point Type_" + (index + 1)] = "Top of descent (VT) (8)";
                    break;
                case 9:
                    record["062_380_Point Type_" + (index + 1)] = "Start of level (VT) (9)";
                    break;
                case 10:
                    record["062_380_Point Type_" + (index + 1)] = "Cross-over altitude (VT) (10)";
                    break;
                case 11:
                    record["062_380_Point Type_" + (index + 1)] = "Transition altitude (VT) (11)";
                    break;
                default:
                    record["062_380_Point Type_" + (index + 1)] = "UNDEFINED";
                    break;
            }

            const tdOctet = octetOfRange(octet11, 3, 2, 1);
            switch (tdOctet) {
                case 0:
                    record["062_380_TD_" + (index + 1)] = "N/A (0)";
                    break;
                case 1:
                    record["062_380_TD_" + (index + 1)] = "Turn right (1)";
                    break;
                case 2:
                    record["062_380_TD_" + (index + 1)] = "Turn left (2)";
                    break;
                case 3:
                    record["062_380_TD_" + (index + 1)] = "No turn (3)";
                    break;
                default:
                    record["062_380_TD_" + (index + 1)] = "UNDEFINED";
                    break;
            }

            if ((octet2 & (1 << 1)) === 0) {
                record["062_380_TRA_" + (index + 1)] = "TTR not available (0)";
            } else {
                record["062_380_TRA_" + (index + 1)] = "TTR available (1)";
            }

            if ((octet2 & (1 << 0)) === 0) {
                record["062_380_TOA_" + (index + 1)] = "TOV available (0)";
            } else {
                record["062_380_TOA_" + (index + 1)] = "TOV not available (1)";
            }

            const octet12 = bitArr[currentPos++];
            const octet13 = bitArr[currentPos++];
            const octet14 = bitArr[currentPos++];

            const tovOctet = (octet12 << (8*2)) | (octet13 << 8) | octet14;

            record["062_380_TOV_" + (index + 1)] = tovOctet;

            const octet15 = bitArr[currentPos++];
            const octet16 = bitArr[currentPos++];

            const ttrOctet = (octet15 << 8) | octet16;

            const ttr = ttrOctet * 0.01;

            record["062_380_TTR_" + (index + 1)] = ttr;
        }
    }

    if (isBitSet(bits, 10, currentPos)) {
        // COM
        const octet1 = bitArr[currentPos++];

        const comOctet = octetOfRange(octet1, 7, 5, 2);
        switch (comOctet) {
            case 0:
                record["062_380_COM"] = "No communications capability (surveillance only) (0)";
                break;
            case 1:
                record["062_380_COM"] = "Comm. A and Comm. B capability (1)";
                break;
            case 2:
                record["062_380_COM"] = "Comm. A, Comm. B and Uplink ELM (2)";
                break;
            case 3:
                record["062_380_COM"] = "Comm. A, Comm. B, Uplink ELM and Downlink ELM (3)";
                break;
            case 4:
                record["062_380_COM"] = "Level 5 Transponder capability 5 to 7 Not assigned (4)";
                break;
            default:
                record["062_380_COM"] = "UNDEFINED";
                break;
        }

        const statOctet = octetOfRange(octet1, 4, 2, 2);
        switch (statOctet) {
            case 0:
                record["062_380_STAT"] = "No alert, no SPI, aircraft airborne (0)";
                break;
            case 1:
                record["062_380_STAT"] = "No alert, no SPI, aircraft on ground (1)";
                break;
            case 2:
                record["062_380_STAT"] = "Alert, no SPI, aircraft airborne (2)";
                break;
            case 3:
                record["062_380_STAT"] = "Alert, no SPI, aircraft on ground (3)";
                break;
            case 4:
                record["062_380_STAT"] = "Alert, SPI, aircraft airborne or on ground (4)";
                break;
            case 5:
                record["062_380_STAT"] = "No alert, SPI, aircraft airborne or on ground (5)";
                break;
            case 6:
                record["062_380_STAT"] = "Not defined (6)";
                break;
            case 7:
                record["062_380_STAT"] = "Unknown or not yet extracted (7)";
                break;
            default:
                record["062_380_STAT"] = "UNDEFINED";
                break;
        }

        const octet2 = bitArr[currentPos++];

        if ((octet2 & (1 << 7)) === 0) {
            record["062_380_SSC"] = "No (0)";
        } else {
            record["062_380_SSC"] = "Yes (1)";
        }

        if ((octet2 & (1 << 6)) === 0) {
            record["062_380_ARC"] = "100 ft resolution (0)";
        } else {
            record["062_380_ARC"] = "25 ft resolution (1)";
        }

        if ((octet2 & (1 << 5)) === 0) {
            record["062_380_AIC"] = "No (0)";
        } else {
            record["062_380_AIC"] = "Yes (1)";
        }

        record["062_380_B1A"] = ((octet2 & (1 << 4)) === 0) ? 0 : 1;

        const b1bOctet = octetOfRange(octet1, 3, 0, 3);

        record["062_380_B1B"] = b1bOctet;
    }

    if (isBitSet(bits, 11, currentPos)) {
        // SAB
        const octet1 = bitArr[currentPos++];

        const acOctet = octetOfRange(octet1, 7, 6, 1);
        switch (acOctet) {
            case 0:
                record["062_380_AC"] = "unknown (0)";
                break;
            case 1:
                record["062_380_AC"] = "ACAS not operational (1)";
                break;
            case 2:
                record["062_380_AC"] = "ACAS operational (2)";
                break;
            case 3:
                record["062_380_AC"] = "invalid (3)";
                break;
            default:
                record["062_380_AC"] = "UNDEFINED";
                break;
        }

        const mnOctet = octetOfRange(octet1, 5, 4, 1);
        switch (mnOctet) {
            case 0:
                record["062_380_MN"] = "unknown (0)";
                break;
            case 1:
                record["062_380_MN"] = "Multiple navigational aids not operating (1)";
                break;
            case 2:
                record["062_380_MN"] = "Multiple navigational aids operating (2)";
                break;
            case 3:
                record["062_380_MN"] = "invalid (3)";
                break;
            default:
                record["062_380_MN"] = "UNDEFINED";
                break;
        }

        const dcOctet = octetOfRange(octet1, 3, 2, 1);
        switch (dcOctet) {
            case 0:
                record["062_380_DC"] = "unknown (0)";
                break;
            case 1:
                record["062_380_DC"] = "Differential correction (1)";
                break;
            case 2:
                record["062_380_DC"] = "No differential correction (2)";
                break;
            case 3:
                record["062_380_DC"] = "invalid (3)";
                break;
            default:
                record["062_380_DC"] = "UNDEFINED";
                break;
        }

        if ((octet1 & (1 << 1)) === 0) {
            record["062_380_GBS"] = "Transponder Ground Bit not set or unknown (0)";
        } else {
            record["062_380_GBS"] = "Transponder Ground Bit set (1)";
        }

        const octet2 = bitArr[currentPos++];

        const statOctet = octetOfRange(octet2, 2, 0, 2);
        switch (statOctet) {
            case 0:
                record["062_380_STAT"] = "No emergency (0)";
                break;
            case 1:
                record["062_380_STAT"] = "General emergency (1)";
                break;
            case 2:
                record["062_380_STAT"] = "Lifeguard / medical (2)";
                break;
            case 3:
                record["062_380_STAT"] = "Minimum fuel (3)";
                break;
            case 4:
                record["062_380_STAT"] = "No communications (4)";
                break;
            case 5:
                record["062_380_STAT"] = "Unlawful interference (5)";
                break;
            case 6:
                record["062_380_STAT"] = "'Downed' Aircraft (6)";
                break;
            case 7:
                record["062_380_STAT"] = "Unknown (7)";
                break;
            default:
                record["062_380_STAT"] = "UNDEFINED";
                break;
        }
    }

    if (isBitSet(bits, 12, currentPos)) {
        // ACS
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];
        const octet3 = bitArr[currentPos++];
        const octet4 = bitArr[currentPos++];
        const octet5 = bitArr[currentPos++];
        const octet6 = bitArr[currentPos++];
        const octet7 = bitArr[currentPos++];

        const mbDataOctet = 
        (octet1 << (8*6)) | (octet2 << (8*5)) | 
        (octet3 << (8*4)) | (octet4 << (8*3)) | 
        (octet5 << (8*2)) | (octet6 << 8) | octet7;

        record["062_380_MB DATA"] = mbDataOctet;
    }
    
    if (isBitSet(bits, 13, currentPos)) {
        // BVR
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const bvrOctet = (octet1 << 8) | octet2;

        const bvr = twosCompliment(bvrOctet, 16) * 6.25;

        record["062_380_Barometric Vertical Rate"] = bvr;
    }

    if (isBitSet(bits, 14, currentPos)) {
        // GVR
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const gvrOctet = (octet1 << 8) | octet2;

        const gvr = twosCompliment(gvrOctet, 16) * 6.25;

        record["062_380_Geometric Vertical Rate"] = gvr;
    }

    if (isBitSet(bits, 15, currentPos)) {
        // RAN
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const raOctet = (octet1 << 8) | octet2;

        const ra = twosCompliment(raOctet, 16) * 0.01;

        record["062_380_Roll Angle"] = ra;
    }

    if (isBitSet(bits, 16, currentPos)) {
        // TAR
        const octet1 = bitArr[currentPos++];

        const tiOctet = octetOfRange(octet1, 7, 6, 1);
        switch (tiOctet) {
            case 0:
                record["062_380_TI"] = "Not available (0)";
                break;
            case 1:
                record["062_380_TI"] = "Left (1)";
                break;
            case 2:
                record["062_380_TI"] = "Right (2)";
                break;
            case 3:
                record["062_380_TI"] = "Straight (3)";
                break;
            default:
                record["062_380_TI"] = "UNDEFINED";
                break;
        }

        const octet2 = bitArr[currentPos++];

        const rotOctet = (octet2 >> 1);

        const rot = rotOctet / 4;

        record["062_380_Rate of Turn"] = rot;
    }

    if (isBitSet(bits, 17, currentPos)) {
        // TAN
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const taOctet = (octet1 << 8) | octet2;

        const ta = (taOctet * 360.0) / (1 << 16);
        
        record["062_380_Track Angle"] = ta;
    }

    if (isBitSet(bits, 18, currentPos)) {
        // GSP
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const gsOctet = (octet1 << 8) | octet2;

        const gs = twosCompliment(gsOctet, 16) / (1 << 14);
        
        record["062_380_Ground Speed"] = gs;
    }

    if (isBitSet(bits, 19, currentPos)) {
        // VUN
        const octet1 = bitArr[currentPos++];

        record["062_380_Velocity Uncertainty Category"] = octet1;
    }

    if (isBitSet(bits, 20, currentPos)) {
        // MET
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 7)) === 0) {
            record["062_380_WS"] = "Not valid Wind Speed (0)";
        } else {
            record["062_380_WS"] = "Valid Wind Speed (1)";
        }

        if ((octet1 & (1 << 6)) === 0) {
            record["062_380_WD"] = "Not valid Wind Direction (0)";
        } else {
            record["062_380_WD"] = "Valid Wind Direction (1)";
        }

        if ((octet1 & (1 << 5)) === 0) {
            record["062_380_TMP"] = "Not valid Temperature (0)";
        } else {
            record["062_380_TMP"] = "Valid Temperature (1)";
        }

        if ((octet1 & (1 << 4)) === 0) {
            record["062_380_TRB"] = "Not valid Turbulence (0)";
        } else {
            record["062_380_TRB"] = "Valid Turbulence (1)";
        }

        const octet2 = bitArr[currentPos++];
        const octet3 = bitArr[currentPos++];

        const wsOctet = (octet2 << 8) | octet3;

        record["062_380_Wind Speed"] = wsOctet;

        const octet4 = bitArr[currentPos++];
        const octet5 = bitArr[currentPos++];

        const wdOctet = (octet4 << 8) | octet5;

        record["062_380_Wind Direction"] = wdOctet;

        const octet6 = bitArr[currentPos++];
        const octet7 = bitArr[currentPos++];

        const tOctet = (octet6 << 8) | octet7;

        record["062_380_Temperature"] = tOctet * 0.25;

        const octet8 = bitArr[currentPos++];

        record["062_380_Turbulence"] = octet8;
    }

    if (isBitSet(bits, 21, currentPos)) {
        // EMC
        const octet1 = bitArr[currentPos++];

        switch (octet1) {
            case 1:
                record["062_380_ECAT"] = "light aircraft <= 7000 kg (1)";
                break;
            case 3:
                record["062_380_ECAT"] = "7000 kg < medium aircraft < 136000 kg (3)";
                break;
            case 5:
                record["062_380_ECAT"] = "136000 kg <= heavy aircraft (5)";
                break;
            case 6:
                record["062_380_ECAT"] = "highly manoeuvrable (5g acceleration capability) and high speed (> 400 knots cruise) (6)";
                break;
            case 10:
                record["062_380_ECAT"] = "rotocraft (10)";
                break;
            case 11:
                record["062_380_ECAT"] = "glider / sailplane (11)";
                break;
            case 12:
                record["062_380_ECAT"] = "lighter-than-air (12)";
                break;
            case 13:
                record["062_380_ECAT"] = "unmanned aerial vehicle (13)";
                break;
            case 14:
                record["062_380_ECAT"] = "space / transatmospheric vehicle (14)";
                break;
            case 15:
                record["062_380_ECAT"] = "ultralight / handglider / paraglider (15)";
                break;
            case 16:
                record["062_380_ECAT"] = "parachutist / skydiver (16)";
                break;
            case 20:
                record["062_380_ECAT"] = "surface emergency vehicle (20)";
                break;
            case 21:
                record["062_380_ECAT"] = "surface service vehicle (21)";
                break;
            case 22:
                record["062_380_ECAT"] = "fixed ground or tethered obstruction (22)";
                break;
            case 2:
            case 4:
            case 7:
            case 8:
            case 9:
            case 17:
            case 18:    
            case 19:    
            case 23:    
            case 24:    
                record["062_380_ECAT"] = "reserved";
                break;
            default:
                record["062_380_ECAT"] = "UNDEFINED";
                break;
        }
    }

    if (isBitSet(bits, 22, currentPos)) {
        // POS
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];
        const octet3 = bitArr[currentPos++];

        const latOctet = (octet1 << (8 * 2)) | (octet2 << 8) | octet3;

        const lat = twosCompliment(latOctet, 24) * 180.0 / (1 << 23);

        record["062_380_Latitude in WGS - 84"] = lat;

        const octet4 = bitArr[currentPos++];
        const octet5 = bitArr[currentPos++];
        const octet6 = bitArr[currentPos++];

        const lngOctet = (octet4 << (8 * 2)) | (octet5 << 8) | octet6;

        const lng = twosCompliment(lngOctet, 24) * 180.0 / (1 << 23);

        record["062_380_Longitude in WGS - 84"] = lng;
    }

    if (isBitSet(bits, 23, currentPos)) {
        // GAL
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const altOctet = (octet1 << 8) | octet2;

        const alt = twosCompliment(altOctet, 24) * 6.25;

        record["062_380_Altitude"] = alt;
    }

    if (isBitSet(bits, 24, currentPos)) {
        // PUN
        const octet1 = bitArr[currentPos++];

        const punOctet = octetOfRange(octet1, 3, 0, 3);

        record["062_380_PUN"] = punOctet;
    }

    if (isBitSet(bits, 25, currentPos)) {
        // MB
        const octet1 = bitArr[currentPos++];

        for (let index = 0; index < octet1; index++) {
            const octet2 = bitArr[currentPos++];
            const octet3 = bitArr[currentPos++];
            const octet4 = bitArr[currentPos++];
            const octet5 = bitArr[currentPos++];
            const octet6 = bitArr[currentPos++];
            const octet7 = bitArr[currentPos++];
            const octet8 = bitArr[currentPos++];

            const altOctet = 
            (octet2 << (8 * 7)) | (octet3 << (8 * 6)) |
            (octet3 << (8 * 5)) | (octet4 << (8 * 4)) |
            (octet5 << (8 * 3)) | (octet6 << (8 * 2)) |
            (octet7 << 8) | octet8;

            record["062_380_MB Data_" + (index + 1)] = altOctet;

            const octet9 = bitArr[currentPos++];

            const bds1Octet = octetOfRange(octet9, 7, 4, 3);

            record["062_380_BDS 1_" + (index + 1)] = bds1Octet;

            const bds2Octet = octetOfRange(octet9, 3, 0, 3);

            record["062_380_BDS 2_" + (index + 1)] = bds2Octet;
        }
    }

    if (isBitSet(bits, 26, currentPos)) {
        // IAR
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const iasOctet = (octet1 << 8) | octet2;

        record["062_380_Indicated Air Speed"] = iasOctet;
    }

    if (isBitSet(bits, 27, currentPos)) {
        // MAC
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const mnOctet = (octet1 << 8) | octet2;

        record["062_380_Mach Number"] = mnOctet * 0.008;
    }

    if (isBitSet(bits, 28, currentPos)) {
        // BPS
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const bpsFrontOctet = octetOfRange(octet1, 3, 0, 3);

        const bps = ((bpsFrontOctet << 8) | octet2) * 0.1;

        record["062_380_Barometric Pressure Setting"] = bps;
    }
}

/**
 * Data Item I062/390,  Flight Plan Related Data
 * 지상 기반 시스템에서 제공하는 모든 비행 계획 관련 정보
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di390 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, currentPos);

    currentPos += headerLen;

    if (isBitSet(bits, 1, currentPos)) {
        // TAG
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        record["062_390_SAC"] = octet1;
        record["062_390_SIC"] = octet2;
    }

    if (isBitSet(bits, 2, currentPos)) {
        // CSN
        let callsign = "";

        // 7번 반복하면서 한 바이트씩 읽어 문자로 변환
        for (let i = 0; i < 7; i++) {
            const charCode = bitArr[currentPos++]; // 1바이트 읽고 포인터 증가
            
            // ASCII 코드를 문자로 변환하여 연결
            callsign += String.fromCharCode(charCode);
        }

        record["062_390_CSN"] = callsign.trim();
    }

    if (isBitSet(bits, 3, currentPos)) {
        // IFI
        const octet1 = bitArr[currentPos++];

        const typOctet = octetOfRange(octet1, 7, 6, 1);
        switch (typOctet) {
            case 0:
                record["062_390_TYP"] = "Plan Number (0)";
                break;
            case 1:
                record["062_390_TYP"] = "Unit 1 internal flight number (1)";
                break;
            case 2:
                record["062_390_TYP"] = "Unit 2 internal flight number (2)";
                break;
            case 3:
                record["062_390_TYP"] = "Unit 3 internal flight number (3)";
                break;
            default:
                record["062_390_TYP"] = "UNDEFINED";
                break;
        }

        const nbrOctet = octetOfRange(octet1, 2, 0, 2);

        const octet2 = bitArr[currentPos++];
        const octet3 = bitArr[currentPos++];
        const octet4 = bitArr[currentPos++];

        const mnOctet = (nbrOctet << (8*3)) | (octet2 << (8*2)) | (octet3 << 8) | octet4;

        record["062_390_TYP"] = mnOctet;
    }

    if (isBitSet(bits, 4, currentPos)) {
        // FCT
        const octet1 = bitArr[currentPos++];

        const goatOctet = octetOfRange(octet1, 7, 6, 1);
        switch (goatOctet) {
            case 0:
                record["062_390_GAT/OAT"] = "Unknown (0)";
                break;
            case 1:
                record["062_390_GAT/OAT"] = "General Air Traffic (1)";
                break;
            case 2:
                record["062_390_GAT/OAT"] = "Operational Air Traffic (2)";
                break;
            case 3:
                record["062_390_GAT/OAT"] = "Not applicable (3)";
                break;
            default:
                record["062_390_GAT/OAT"] = "UNDEFINED";
                break;
        }

        const fr12Octet = octetOfRange(octet1, 5, 4, 1);
        switch (fr12Octet) {
            case 0:
                record["062_390_FR1/FR2"] = "Instrument Flight Rules (0)";
                break;
            case 1:
                record["062_390_FR1/FR2"] = "Visual Flight rules (1)";
                break;
            case 2:
                record["062_390_FR1/FR2"] = "Not applicable (2)";
                break;
            case 3:
                record["062_390_FR1/FR2"] = "Controlled Visual Flight Rules (3)";
                break;
            default:
                record["062_390_FR1/FR2"] = "UNDEFINED";
                break;
        }

        const rvsmOctet = octetOfRange(octet1, 3, 2, 1);
        switch (rvsmOctet) {
            case 0:
                record["062_390_RVSM"] = "Unknown (0)";
                break;
            case 1:
                record["062_390_RVSM"] = "Approved (1)";
                break;
            case 2:
                record["062_390_RVSM"] = "Exempt (2)";
                break;
            case 3:
                record["062_390_RVSM"] = "Not Approved (3)";
                break;
            default:
                record["062_390_RVSM"] = "UNDEFINED";
                break;
        }

        if ((octet1 & (1 << 1)) === 0) {
            record["062_390_HPR"] = "Normal Priority Flight (0)";
        } else {
            record["062_390_HPR"] = "High Priority Flight (1)";
        }

    }

    if (isBitSet(bits, 5, currentPos)) {
        // TAC
        let typeOfAircraft = "";

        // 4번 반복하면서 한 바이트씩 읽어 문자로 변환
        for (let i = 0; i < 4; i++) {
            const charCode = bitArr[currentPos++]; // 1바이트 읽고 포인터 증가
            
            // ASCII 코드를 문자로 변환하여 연결
            typeOfAircraft += String.fromCharCode(charCode);
        }

        record["062_390_Type of Aircraft"] = typeOfAircraft.trim();
    }

    if (isBitSet(bits, 6, currentPos)) {
        // WTC
        const wtc = bitArr[currentPos++]; 

        switch (String.fromCharCode(wtc)) {
            case "L":
                record["062_390_Wake Turbulence Category"] = "Light";
                break;
            case "M":
                record["062_390_Wake Turbulence Category"] = "Medium";
                break;
            case "H":
                record["062_390_Wake Turbulence Category"] = "Heavy";
                break;
            case "J":
                record["062_390_Wake Turbulence Category"] = "Super";
                break;
            default:
                record["062_390_Wake Turbulence Category"] = "UNDEFINDED";
                break;
        }
    }

    if (isBitSet(bits, 7, currentPos)) {
        // DEP
        let depAirport = "";

        // 4번 반복하면서 한 바이트씩 읽어 문자로 변환
        for (let i = 0; i < 4; i++) {
            const charCode = bitArr[currentPos++]; // 1바이트 읽고 포인터 증가
            
            // ASCII 코드를 문자로 변환하여 연결
            depAirport += String.fromCharCode(charCode);
        }

        record["062_390_Departure Airport"] = depAirport.trim();
    }

    if (isBitSet(bits, 8, currentPos)) {
        // DST
        let desAirport = "";

        // 4번 반복하면서 한 바이트씩 읽어 문자로 변환
        for (let i = 0; i < 4; i++) {
            const charCode = bitArr[currentPos++]; // 1바이트 읽고 포인터 증가
            
            // ASCII 코드를 문자로 변환하여 연결
            desAirport += String.fromCharCode(charCode);
        }

        record["062_390_Destination Airport"] = desAirport.trim();
    }

    if (isBitSet(bits, 9, currentPos)) {
        // RDS
        const octet1 = bitArr[currentPos++]; 
        const octet2 = bitArr[currentPos++]; 
        const octet3 = bitArr[currentPos++]; 

        record["062_390_Runway Designation"] = octet1.toString() + octet2.toString() + String.fromCharCode(octet3);
    }

    if (isBitSet(bits, 10, currentPos)) {
        // CFL
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        const cflOctet = (octet1 << 8) | octet2;

        const cfl = cflOctet * 0.25;

        record["062_390_CFL"] = cfl;
    }

    if (isBitSet(bits, 11, currentPos)) {
        // CTL
        const octet1 = bitArr[currentPos++];
        const octet2 = bitArr[currentPos++];

        record["062_390_Centre"] = octet1;
        record["062_390_Position"] = octet2;
    }

    if (isBitSet(bits, 12, currentPos)) {
        // TOD
        const octet1 = bitArr[currentPos++];

        for (let index = 0; index < octet1; index++) {
            const octet2 = bitArr[currentPos++];

            const typOctet = octetOfRange(octet2, 7, 3, 4);
            switch (typOctet) {
                case 0:
                    record["062_390_TYP_" + (index + 1)] = "Scheduled off-block time (0)";
                    break;
                case 1:
                    record["062_390_TYP_" + (index + 1)] = "Estimated off-block time (1)";
                    break;
                case 2:
                    record["062_390_TYP_" + (index + 1)] = "Estimated take-off time (2)";
                    break;
                case 3:
                    record["062_390_TYP_" + (index + 1)] = "Actual off-block time (3)";
                    break;
                case 4:
                    record["062_390_TYP_" + (index + 1)] = "Predicted time at runway hold (4)";
                    break;
                case 5:
                    record["062_390_TYP_" + (index + 1)] = "Actual time at runway hold (5)";
                    break;
                case 6:
                    record["062_390_TYP_" + (index + 1)] = "Actual line-up time (6)";
                    break;
                case 7:
                    record["062_390_TYP_" + (index + 1)] = "Actual take-up time (7)";
                    break;
                case 8:
                    record["062_390_TYP_" + (index + 1)] = "Estimated time of arrival (8)";
                    break;
                case 9:
                    record["062_390_TYP_" + (index + 1)] = "Predicted landing time (9)";
                    break;
                case 10:
                    record["062_390_TYP_" + (index + 1)] = "Actual landing time (10)";
                    break;
                case 11:
                    record["062_390_TYP_" + (index + 1)] = "Actual time off runway (11)";
                    break;
                case 12:
                    record["062_390_TYP_" + (index + 1)] = "Predicted time to gate (12)";
                    break;
                case 13:
                    record["062_390_TYP_" + (index + 1)] = "Actual on-block time (13)";
                    break;
                default:
                    record["062_390_TYP_" + (index + 1)] = "UNDEFINED";
                    break;
            }

            const dayOctet = octetOfRange(octet2, 2, 1, 1);
            switch (dayOctet) {
                case 0:
                    record["062_390_DAY_" + (index + 1)] = "Today (0)";
                    break;
                case 1:
                    record["062_390_DAY_" + (index + 1)] = "Yesterday (1)";
                    break;
                case 2:
                    record["062_390_DAY_" + (index + 1)] = "Tomorrow (2)";
                    break;
                case 3:
                    record["062_390_DAY_" + (index + 1)] = "Invalid (3)";
                    break;
                default:
                    record["062_390_DAY_" + (index + 1)] = "UNDEFINED";
                    break;
            }

            const octet3 = bitArr[currentPos++];

            const hourOctet = octetOfRange(octet3, 4, 0, 4);

            record["062_390_HOR_" + (index + 1)] = hourOctet;

            const octet4 = bitArr[currentPos++];

            const minOctet = octetOfRange(octet4, 5, 0, 5);

            record["062_390_MIN_" + (index + 1)] = minOctet;

            const octet5 = bitArr[currentPos++];

            if ((octet5 & (1 << 7)) === 0) {
                record["062_390_AVS_" + (index + 1)] = "Seconds available (0)";
            } else {
                record["062_390_AVS_" + (index + 1)] = "Seconds not available (1)";
            }

            const secOctet = octetOfRange(octet5, 5, 0, 5);

            record["062_390_SEC_" + (index + 1)] = secOctet;
        }
    }

    if (isBitSet(bits, 13, currentPos)) {
        // AST
        let aircraftStand = "";

        // 6번 반복하면서 한 바이트씩 읽어 문자로 변환
        for (let i = 0; i < 6; i++) {
            const charCode = bitArr[currentPos++]; // 1바이트 읽고 포인터 증가
            
            // ASCII 코드를 문자로 변환하여 연결
            aircraftStand += String.fromCharCode(charCode);
        }

        record["062_390_Aircraft Stand"] = aircraftStand.trim();
    }

    if (isBitSet(bits, 14, currentPos)) {
        // STS
        const octet1 = bitArr[currentPos++];

        const empOctet = octetOfRange(octet1, 7, 6, 1);
        switch (empOctet) {
            case 0:
                record["062_390_EMP"] = "Empty (0)";
                break;
            case 1:
                record["062_390_EMP"] = "Occupied (1)";
                break;
            case 2:
                record["062_390_EMP"] = "Unknown (2)";
                break;
            case 3:
                record["062_390_EMP"] = "Invalid (3)";
                break;
            default:
                record["062_390_EMP"] = "UNDEFINED";
                break;
        }

        const avlOctet = octetOfRange(octet1, 6, 5, 1);
        switch (avlOctet) {
            case 0:
                record["062_390_AVL"] = "Available (0)";
                break;
            case 1:
                record["062_390_AVL"] = "Not available (1)";
                break;
            case 2:
                record["062_390_AVL"] = "Unknown (2)";
                break;
            case 3:
                record["062_390_AVL"] = "Invalid (3)";
                break;
            default:
                record["062_390_AVL"] = "UNDEFINED";
                break;
        }
    }

    if (isBitSet(bits, 15, currentPos)) {
        // STD
        let sid = "";

        // 7번 반복하면서 한 바이트씩 읽어 문자로 변환
        for (let i = 0; i < 7; i++) {
            const charCode = bitArr[currentPos++]; // 1바이트 읽고 포인터 증가
            
            // ASCII 코드를 문자로 변환하여 연결
            sid += String.fromCharCode(charCode);
        }

        record["062_390_Standard Instrument Departure"] = sid.trim();
    }

    if (isBitSet(bits, 16, currentPos)) {
        // STA
        let sia = "";

        // 7번 반복하면서 한 바이트씩 읽어 문자로 변환
        for (let i = 0; i < 7; i++) {
            const charCode = bitArr[currentPos++]; // 1바이트 읽고 포인터 증가
            
            // ASCII 코드를 문자로 변환하여 연결
            sia += String.fromCharCode(charCode);
        }

        record["062_390_Standard Instrument Arrival"] = sia.trim();
    }

    if (isBitSet(bits, 17, currentPos)) {
        // PEM
        const octet1 = bitArr[currentPos++];

        if ((octet1 & (1 << 7)) === 0) {
            record["062_390_VA"] = "No valid Mode 3/A available (0)";
        } else {
            record["062_390_VA"] = "Valid Mode 3/A available (1)";
        }

        const octet2 = bitArr[currentPos++];

        const aStr = octetOfRange(octet1, 3, 1, 2).toString();
        const bStr = ((octetOfRange(octet1, 0, 0, 0) << 2) | octetOfRange(octet2, 7, 6, 1)).toString();
        const cStr = octetOfRange(octet2, 5, 3, 2).toString();
        const dStr = octetOfRange(octet2, 2, 0, 2).toString();

        record["062_390_Pre-Emergency Mode 3/A"] = aStr + bStr + cStr + dStr;
    }

    if (isBitSet(bits, 18, currentPos)) {
        // PEC
        let pec = "";

        // 7번 반복하면서 한 바이트씩 읽어 문자로 변환
        for (let i = 0; i < 7; i++) {
            const charCode = bitArr[currentPos++]; // 1바이트 읽고 포인터 증가
            
            // ASCII 코드를 문자로 변환하여 연결
            pec += String.fromCharCode(charCode);
        }

        record["062_390_Pre-Emergency Callsign"] = pec.trim();
    }
}

/**
 * Data Item I062/500, Estimated Accuracies
 * 모든 주요 정확도에 대한 개요
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di500 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, currentPos);

    currentPos += headerLen;

    if (isBitSet(bits, 1, currentPos)) {
        // APC
        const octet1 = bitArr[currentPos++]; 
        const octet2 = bitArr[currentPos++]; 

        const apcXOctet = (octet1 << 8) | octet2;

        record["062_500_APC (X-Component)"] = apcXOctet * 0.5;
        
        const octet3 = bitArr[currentPos++];
        const octet4 = bitArr[currentPos++];
        
        const apcYOctet = (octet3 << 8) | octet4;
        
        record["062_500_APC (Y-Component)"] = apcYOctet * 0.5;
    }

    if (isBitSet(bits, 2, currentPos)) {
        // COV
        const octet1 = bitArr[currentPos++]; 
        const octet2 = bitArr[currentPos++]; 

        const covOctet = (octet1 << 8) | octet2;

        const cov = twosCompliment(covOctet, 16) * 0.5;

        record["062_500_COV (XY Covariance Component)"] = cov;
    }

    if (isBitSet(bits, 3, currentPos)) {
        // APW
        const octet1 = bitArr[currentPos++]; 
        const octet2 = bitArr[currentPos++]; 

        const apwLatOctet = (octet1 << 8) | octet2;

        const apwLat = apwLatOctet * 180.0 / (1 << 25);

        record["062_500_APW (Latitude Component)"] = apwLat;
        
        const octet3 = bitArr[currentPos++];
        const octet4 = bitArr[currentPos++];
        
        const apwLngOctet = (octet3 << 8) | octet4;

        const apwLng = apwLngOctet * 180.0 / (1 << 25);
        
        record["062_500_APW (Longitude Component)"] = apwLng;
    }

    if (isBitSet(bits, 4, currentPos)) {
        // AGA
        const octet1 = bitArr[currentPos++]; 

        const aga = octet1 * 6.25;

        record["062_500_AGA"] = aga;
    }

    if (isBitSet(bits, 5, currentPos)) {
        // ABA
        const octet1 = bitArr[currentPos++]; 

        const aba = octet1 * 0.25;

        record["062_500_ABA"] = aba;
    }

    if (isBitSet(bits, 6, currentPos)) {
        // ATV
        const octet1 = bitArr[currentPos++]; 

        const atvX = octet1 * 0.25;

        record["062_500_ATV (X-Component)"] = atvX;

        const octet2 = bitArr[currentPos++];

        const atvY = octet2 * 0.25;

        record["062_500_ATV (Y-Component)"] = atvY;
    }

    if (isBitSet(bits, 7, currentPos)) {
        // AA
        const octet1 = bitArr[currentPos++];

        const aaX = octet1 * 0.25;

        record["062_500_AA (X-Component)"] = aaX;

        const octet2 = bitArr[currentPos++];

        const aaY = octet2 * 0.25;

        record["062_500_AA (Y-Component)"] = aaY;
    }

    if (isBitSet(bits, 8, currentPos)) {
        // ARC
        const octet1 = bitArr[currentPos++];

        const arc = octet1 * 6.25;

        record["062_500_ARC"] = arc;
    }
}

/**
 * Data Item I062/510, Composed Track Number
 * 시스템 항적 식별
 * 가변 길이
 * @param record 단일 Record 파싱 결과
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 */
const di510 = (record: Record, bitArr: Uint8Array, currentPos: number) => {
    const octet1 = bitArr[currentPos++];

    record["062_510_SYSTEM UNIT IDENTIFICATION_FIRST"] = octet1;

    const octet2 = bitArr[currentPos++];
    const octet3 = bitArr[currentPos++];
    const flag1 = octet3;

    const stn1Octet = (octet2 << 7) | (octet3 >> 1);

    record["062_510_SYSTEM TRACK NUMBER_FIRST"] = stn1Octet;

    if ((flag1 & (1)) === 0) return;

    const octet4 = bitArr[currentPos++];

    record["062_510_SYSTEM UNIT IDENTIFICATION_SECOND"] = octet4;

    const octet5 = bitArr[currentPos++];
    const octet6 = bitArr[currentPos++];

    const stn2Octet = (octet5 << 7) | (octet6 >> 1);

    record["062_510_SYSTEM TRACK NUMBER_SECOND"] = stn2Octet;
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
    record["062_SP"] = getHexString(bitArr, currentPos, diLength);
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
    record["062_RE"] = getHexString(bitArr, currentPos, diLength);
}

export { cat062Process }