import { CAT021_UAP } from "../data/uap/cat021";

type FieldSpec = {
    [dataItem: string]: number;
};

/**
 * UAP 정보를 통해 FieldSpec을 반환하는 함수
 * @param category 카테고리
 * @param data 바이트 데이터
 * @param pos 데이터 순회 인덱스
 * @returns FieldSpec과 다음 인덱스
 */
const getFieldSpec = (category: number, bitArr: Uint8Array, pos: number) => {
    const fieldSpec: FieldSpec = {};

    // 행 번호
    let block = 1;

    // * 현재 바이트의 마지막 비트가 0일 때까지 반복
    while (true) {
        const currentByte = bitArr[pos++];

        for (let bit = 7; bit >= 1; bit--) {
            // * 해당 비트가 0이면 data item이 없다는 뜻이므로 넘김
            if ((currentByte & (1 << bit)) === 0) {
                continue;
            }
            
            // 열 번호
            const frn = 7 - bit + 1;

            if (category === 21) {
                const dataItem = CAT021_UAP[block][frn].dataItem;
                const length = CAT021_UAP[block][frn].length;

                fieldSpec[dataItem] = length;
            }
        }

        // * 마지막 비트가 0이면 종료
        if ((currentByte & 1) === 0) {
            break;
        }

        block++;
    }

    const recordIndex = pos;

    return { fieldSpec, recordIndex };
}

/**
 * FX 비트를 체크하여 확장되는 헤더를 읽고 { 비트조합, 헤더길이 }를 반환
 * @param bitArr 비트 데이터
 * @param recordIndex record 시작 인덱스
 * @returns { 비트 조합, 헤더 길이 }
 */
const parseIndicator = (bitArr: Uint8Array, recordIndex: number) => {
    let hasExtension = true;

    let bits = 0;
    let headerLen = 0;

    while (hasExtension) {
        const currentByte = bitArr[recordIndex++];

        hasExtension = (currentByte & 1) != 0;

        // FX 비트를 제거한 후 합침
        bits = (bits << 7) | (currentByte >> 1)
        headerLen++;
    }

    return { bits, headerLen };
}


/**
 * SP과 RE에서 사용
 * @param bitArr Asterix 바이트 데이터
 * @param currentPos 데이터 아이템 시작 인덱스
 * @param length 데이터 길이
 * @returns 문자열 
 */
const getHexString = (bitArr: number[] | Uint8Array, currentPos: number, length: number): string => {
    const hexArray = "0123456789abcdef";
    const result: string[] = [];

    for (let i = 0; i < length; i++) {
        // 배열 범위를 벗어나는지 체크 (안전장치, 필요 없으면 생략 가능)
        if (currentPos + i >= bitArr.length) break;

        const v = bitArr[currentPos + i] & 0xFF;
        result.push(hexArray[v >> 4]);
        result.push(hexArray[v & 0x0F]);
    }

    return result.join('');
}

export { FieldSpec, getFieldSpec, parseIndicator, getHexString }