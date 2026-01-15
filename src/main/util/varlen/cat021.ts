import { parseIndicator } from '../preprocess';
import { isBitSet } from '../common';

/**
 * CAT 021의 가변 데이터 길이
 * @param bitArr 비트 데이터
 * @param recordIndex record 인덱스
 * @param dataItem 데이터 아이템 이름
 * @returns 각 데이터 아이템의 길이
 */
const cat021VarLen = (bitArr: Uint8Array, recordIndex: number, dataItem: string) => {
    switch (dataItem) {
        case "di040":
        case "di090":
        case "di271":
            return checkLastBit(bitArr, recordIndex);
        case "di220":
            return di220Len(bitArr, recordIndex);
        case "di110":
            return di110Len(bitArr, recordIndex);
        case "di250": 
            return di250Len(bitArr, recordIndex);
        case "di295":
            return di295Len(bitArr, recordIndex);
        case "SP":
        case "RE":
            return spAndReLen(bitArr, recordIndex);
        default:
            return 0;
    }
}

/**
 * 마지막 비트를 보고 추가 확장이 있는지 판단
 * CAT 021: 040, 090
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
 * CAT 021: 220
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di220Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    let diLength = headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // WS
        diLength += 2;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // WD
        diLength += 2;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // TMP
        diLength += 2;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // TRB
        diLength += 1;
    }

    return diLength;
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 1개
 * CAT 021: 110
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di110Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    // 헤더 길이
    let diLength = headerLen;
    // 실제 데이터 시작 위치
    let dataStartIndex = recordIndex + headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // TIS
        diLength += 1;
        dataStartIndex += 1;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // TID
        // 반복 횟수
        const rep = bitArr[dataStartIndex];
        diLength += (1 + (rep * 15));
    }

    return diLength;
}

/**
 * 첫 rep 값으로 그 뒤의 8 octet이 반복
 * CAT 021: 250
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di250Len = (bitArr: Uint8Array, recordIndex: number) => {
    const rep = bitArr[recordIndex];

    return 1 + (rep * 8);
}

/**
 * Primary Subfield를 통해 특정 Subfield가 추가
 * Primary Subfield 최대 4개
 * CAT 021: 295
 * @param bitArr 바이트 값
 * @param recordIndex record 시작 인덱스
 * @returns 데이터 길이
 */
const di295Len = (bitArr: Uint8Array, recordIndex: number) => {
    const { bits, headerLen } = parseIndicator(bitArr, recordIndex);

    let diLength = headerLen;

    if (isBitSet(bits, 1, headerLen)) {
        // AOS
        diLength += 1;
    }

    if (isBitSet(bits, 2, headerLen)) {
        // TRD
        diLength += 1;
    }

    if (isBitSet(bits, 3, headerLen)) {
        // M3A
        diLength += 1;
    }

    if (isBitSet(bits, 4, headerLen)) {
        // QI
        diLength += 1;
    }

    if (isBitSet(bits, 5, headerLen)) {
        // TI
        diLength += 1;
    }

    if (isBitSet(bits, 6, headerLen)) {
        // MAM
        diLength += 1;
    }

    if (isBitSet(bits, 7, headerLen)) {
        // GH
        diLength += 1;
    }

    if (isBitSet(bits, 8, headerLen)) {
        // FL
        diLength += 1;
    }

    if (isBitSet(bits, 9, headerLen)) {
        // ISA
        diLength += 1;
    }

    if (isBitSet(bits, 10, headerLen)) {
        // ISA
        diLength += 1;
    }

    if (isBitSet(bits, 11, headerLen)) {
        // AS
        diLength += 1;
    }

    if (isBitSet(bits, 12, headerLen)) {
        // TAS
        diLength += 1;
    }

    if (isBitSet(bits, 13, headerLen)) {
        // MH
        diLength += 1;
    }

    if (isBitSet(bits, 14, headerLen)) {
        // BVR
        diLength += 1;
    }

    if (isBitSet(bits, 15, headerLen)) {
        // GVR
        diLength += 1;
    }

    if (isBitSet(bits, 16, headerLen)) {
        // GV
        diLength += 1;
    }

    if (isBitSet(bits, 17, headerLen)) {
        // TAR
        diLength += 1;
    }

    if (isBitSet(bits, 18, headerLen)) {
        // TI
        diLength += 1;
    }

    if (isBitSet(bits, 19, headerLen)) {
        // TS
        diLength += 1;
    }

    if (isBitSet(bits, 20, headerLen)) {
        // MET
        diLength += 1;
    }

    if (isBitSet(bits, 21, headerLen)) {
        // ROA
        diLength += 1;
    }

    if (isBitSet(bits, 22, headerLen)) {
        // ARA
        diLength += 1;
    }

    if (isBitSet(bits, 23, headerLen)) {
        // SCC
        diLength += 1;
    }

    return diLength;
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

export { cat021VarLen };