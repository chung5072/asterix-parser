import { parseIndicator } from '../preprocess';
import { isBitSet } from '../common';

/**
 * CAT 062의 가변 데이터 길이
 * @param bitArr 비트 데이터
 * @param recordIndex record 인덱스
 * @param dataItem 데이터 아이템 이름
 * @returns 각 데이터 아이템의 길이
 */
const cat062VarLen = (bitArr: Uint8Array, recordIndex: number, dataItem: string) => {
    switch (dataItem) {
        case "di080":
        case "di270": 
            return checkLastBit(bitArr, recordIndex);
        case "di110":
            return di110Len(bitArr, recordIndex);
        case "di290":
            return di290Len(bitArr, recordIndex);
        case "di295":
            return di295Len(bitArr, recordIndex);
        case "di340":
            return di340Len(bitArr, recordIndex);
        case "di380":
            return di380Len(bitArr, recordIndex);
        case "di390":
            return di390Len(bitArr, recordIndex);
        case "di500":
            return di500Len(bitArr, recordIndex);
        case "di510":
            return di510Len(bitArr, recordIndex);
        case "SP":
        case "RE":
            return spAndReLen(bitArr, recordIndex);
        default:
            return 0;
    }
}

/**
 * 마지막 비트를 보고 추가 확장이 있는지 판단
 * CAT 062: 080
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const checkLastBit = (bitArr: Uint8Array, recordIndex: number) => {
    // octet 개수
    let octetCount = 0;

    // 추가 확장 유무
    let hasExtension = true;
    
    while (hasExtension) {
        const currentByte = bitArr[recordIndex++];

        hasExtension = (currentByte & 1) != 0;
        octetCount++;
    }

    return octetCount;
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 1개
 * CAT 062: 295
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di110Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    let diLength = headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // SUM
        diLength += 1;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // PMN
        diLength += 4;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // POS
        diLength += 6;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // GA
        diLength += 2;
    }

    if (isBitSet(bits, 5, headerLen)) {
        // EM1
        diLength += 2;
    }

    if (isBitSet(bits, 6, headerLen)) {
        // TOS
        diLength += 1;
    }

    if (isBitSet(bits, 7, headerLen)) {
        // XP
        diLength += 1;
    }

    return diLength;
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 1개
 * CAT 062: 290
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di290Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    let diLength = headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // TRK
        diLength += 1;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // PSR
        diLength += 1;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // SSR
        diLength += 1;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // MDS
        diLength += 1;
    }

    if (isBitSet(bits, 5, headerLen)) {
        // ADS
        diLength += 2;
    }

    if (isBitSet(bits, 6, headerLen)) {
        // ES
        diLength += 1;
    }

    if (isBitSet(bits, 7, headerLen)) {
        // VDL
        diLength += 1;
    }

    if (isBitSet(bits, 8, headerLen)) {
        // UAT
        diLength += 1;
    }

    if (isBitSet(bits, 9, headerLen)) {
        // LOP
        diLength += 1;
    }

    if (isBitSet(bits, 10, headerLen)) {
        // MLT
        diLength += 1;
    }

    return diLength;
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 1개
 * CAT 062: 295
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di295Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    let diLength = headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // MFL
        diLength += 1;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // MD1
        diLength += 1;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // MD2
        diLength += 1;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // MDA
        diLength += 1;
    }

    if (isBitSet(bits, 5, headerLen)) {
        // MD4
        diLength += 1;
    }

    if (isBitSet(bits, 6, headerLen)) {
        // MD5
        diLength += 1;
    }

    if (isBitSet(bits, 7, headerLen)) {
        // MHG
        diLength += 1;
    }

    if (isBitSet(bits, 8, headerLen)) {
        // IAS
        diLength += 1;
    }

    if (isBitSet(bits, 9, headerLen)) {
        // TAS
        diLength += 1;
    }

    if (isBitSet(bits, 10, headerLen)) {
        // SAL
        diLength += 1;
    }

    if (isBitSet(bits, 11, headerLen)) {
        // FSS
        diLength += 1;
    }

    if (isBitSet(bits, 12, headerLen)) {
        // TID
        diLength += 1;
    }

    if (isBitSet(bits, 13, headerLen)) {
        // COM
        diLength += 1;
    }

    if (isBitSet(bits, 14, headerLen)) {
        // SAB
        diLength += 1;
    }

    if (isBitSet(bits, 15, headerLen)) {
        // ACS
        diLength += 1;
    }

    if (isBitSet(bits, 16, headerLen)) {
        // BVR
        diLength += 1;
    }

    if (isBitSet(bits, 17, headerLen)) {
        // GVR
        diLength += 1;
    }

    if (isBitSet(bits, 18, headerLen)) {
        // RAN
        diLength += 1;
    }

    if (isBitSet(bits, 19, headerLen)) {
        // TAR
        diLength += 1;
    }

    if (isBitSet(bits, 20, headerLen)) {
        // TAN
        diLength += 1;
    }

    if (isBitSet(bits, 21, headerLen)) {
        // GSP
        diLength += 1;
    }

    if (isBitSet(bits, 22, headerLen)) {
        // VUN
        diLength += 1;
    }

    if (isBitSet(bits, 23, headerLen)) {
        // MET
        diLength += 1;
    }

    if (isBitSet(bits, 24, headerLen)) {
        // EMC
        diLength += 1;
    }

    if (isBitSet(bits, 25, headerLen)) {
        // POS
        diLength += 1;
    }

    if (isBitSet(bits, 26, headerLen)) {
        // GAL
        diLength += 1;
    }

    if (isBitSet(bits, 27, headerLen)) {
        // PUN
        diLength += 1;
    }

    if (isBitSet(bits, 28, headerLen)) {
        // MB
        diLength += 1;
    }

    if (isBitSet(bits, 29, headerLen)) {
        // IAR
        diLength += 1;
    }

    if (isBitSet(bits, 30, headerLen)) {
        // MAC
        diLength += 1;
    }

    if (isBitSet(bits, 31, headerLen)) {
        // BPS
        diLength += 1;
    }

    return diLength;
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 1개
 * CAT 062: 340
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di340Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    let diLength = headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // SID
        diLength += 2;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // POS
        diLength += 4;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // HEI
        diLength += 2;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // MDC
        diLength += 2;
    }

    if (isBitSet(bits, 5, headerLen)) {
        // MDA
        diLength += 2;
    }

    if (isBitSet(bits, 6, headerLen)) {
        // TYP
        diLength += 1;
    }

    return diLength;
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 4개
 * CAT 062: 380
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di380Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    // 헤더 길이
    let diLength = headerLen;
    // 실제 데이터 시작 위치
    let dataStartIndex = recordIndex + headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // ADR
        diLength += 3;
        dataStartIndex += 3;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // ID
        // 반복 횟수
        diLength += 6;
        dataStartIndex += 6;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // MHG
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // IAS
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 5, headerLen)) {
        // TAS
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 6, headerLen)) {
        // SAL
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 7, headerLen)) {
        // FSS
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 8, headerLen)) {
        // TIS
        diLength += 1;
        dataStartIndex += 1;
    }

    if (isBitSet(bits, 9, headerLen)) {
        // TID
        // 반복 횟수
        const rep = bitArr[dataStartIndex];
        diLength += (1 + (rep * 15));
        dataStartIndex += (1 + (rep * 15));
    }

    if (isBitSet(bits, 10, headerLen)) {
        // COM
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 11, headerLen)) {
        // SAB
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 12, headerLen)) {
        // ACS
        diLength += 7;
        dataStartIndex += 7;
    }

    if (isBitSet(bits, 13, headerLen)) {
        // BVR
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 14, headerLen)) {
        // GVR
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 15, headerLen)) {
        // RAN
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 16, headerLen)) {
        // TAR
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 17, headerLen)) {
        // TAN
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 18, headerLen)) {
        // GSP
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 19, headerLen)) {
        // VUN
        diLength += 1;
        dataStartIndex += 1;
    }

    if (isBitSet(bits, 20, headerLen)) {
        // MET
        diLength += 8;
        dataStartIndex += 8;
    }

    if (isBitSet(bits, 21, headerLen)) {
        // EMC
        diLength += 1;
        dataStartIndex += 1;
    }

    if (isBitSet(bits, 22, headerLen)) {
        // POS
        diLength += 6;
        dataStartIndex += 6;
    }

    if (isBitSet(bits, 23, headerLen)) {
        // GAL
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 24, headerLen)) {
        // PUN
        diLength += 1;
        dataStartIndex += 1;
    }

    if (isBitSet(bits, 25, headerLen)) {
        // MB
        // 반복 횟수
        const rep = bitArr[dataStartIndex];
        diLength += (1 + (rep * 8));
        dataStartIndex += (1 + (rep * 8));
    }

    if (isBitSet(bits, 26, headerLen)) {
        // IAR
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 27, headerLen)) {
        // MAC
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 28, headerLen)) {
        // BPS
        diLength += 2;
        dataStartIndex += 2;
    }

    return diLength;
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 4개
 * CAT 062: 390
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di390Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    // 헤더 길이
    let diLength = headerLen;
    // 실제 데이터 시작 위치
    let dataStartIndex = recordIndex + headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // TAG
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // CSN
        diLength += 7;
        dataStartIndex += 7;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // IFI
        diLength += 4;
        dataStartIndex += 4;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // FCT
        diLength += 1;
        dataStartIndex += 1;
    }

    if (isBitSet(bits, 5, headerLen)) {
        // TAC
        diLength += 4;
        dataStartIndex += 4;
    }

    if (isBitSet(bits, 6, headerLen)) {
        // WTC
        diLength += 1;
        dataStartIndex += 1;
    }

    if (isBitSet(bits, 7, headerLen)) {
        // DEP
        diLength += 4;
        dataStartIndex += 4;
    }

    if (isBitSet(bits, 8, headerLen)) {
        // DST
        diLength += 4;
        dataStartIndex += 4;
    }

    if (isBitSet(bits, 9, headerLen)) {
        // RDS
        diLength += 3;
        dataStartIndex += 3;
    }

    if (isBitSet(bits, 10, headerLen)) {
        // CFL
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 11, headerLen)) {
        // CTL
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 12, headerLen)) {
        // TOD
        // 반복 횟수
        const rep = bitArr[dataStartIndex];
        diLength += (1 + (rep * 4));
        dataStartIndex += (1 + (rep * 4));
    }

    if (isBitSet(bits, 13, headerLen)) {
        // AST
        diLength += 6;
        dataStartIndex += 6;
    }

    if (isBitSet(bits, 14, headerLen)) {
        // STS
        diLength += 1;
        dataStartIndex += 1;
    }

    if (isBitSet(bits, 15, headerLen)) {
        // STD
        diLength += 7;
        dataStartIndex += 7;
    }

    if (isBitSet(bits, 16, headerLen)) {
        // STA
        diLength += 7;
        dataStartIndex += 7;
    }

    if (isBitSet(bits, 17, headerLen)) {
        // PEM
        diLength += 2;
        dataStartIndex += 2;
    }

    if (isBitSet(bits, 18, headerLen)) {
        // PEC
        diLength += 7;
        dataStartIndex += 7;
    }

    return diLength;
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 1개
 * CAT 062: 500
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di500Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    let diLength = headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // APC
        diLength += 4;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // COV
        diLength += 2;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // APW
        diLength += 4;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // AGA
        diLength += 1;
    }

    if (isBitSet(bits, 5, headerLen)) {
        // ABA
        diLength += 1;
    }

    if (isBitSet(bits, 6, headerLen)) {
        // ATV
        diLength += 2;
    }

    if (isBitSet(bits, 7, headerLen)) {
        // AA
        diLength += 2;
    }

    if (isBitSet(bits, 8, headerLen)) {
        // ARC
        diLength += 1;
    }

    return diLength;
}

/**
 * 마지막 비트를 보고 추가 확장이 있는지 판단
 * CAT 062: 510
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di510Len = (bitArr: Uint8Array, recordIndex: number) => {
    let totalLen = 0;
    
    // 현재 검사할 덩어리의 시작 위치
    let currentPos = recordIndex; 
    let hasExtension = true;

    while (hasExtension) {
        // 3바이트 덩어리 중 마지막 바이트를 확인해야 함
        const checkIndex = currentPos + 2;
        
        // 배열 범위를 벗어나지 않는지 체크
        if (checkIndex >= bitArr.length) break;

        const currentByte = bitArr[checkIndex];

        hasExtension = (currentByte & 1) !== 0;

        // 길이 3 누적
        totalLen += 3;
        
        // 다음 덩어리로 이동 
        currentPos += 3;
    }

    return totalLen;
}

/**
 * 첫 번째 패킷 데이터를 보고 데이터 전체 길이를 유추
 * SP, RE
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const spAndReLen = (bitArr: Uint8Array, recordIndex: number) => {
    return bitArr[recordIndex];
}

export { cat062VarLen };