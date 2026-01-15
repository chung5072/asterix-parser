/**
 * 비트가 켜져있는지 확인
 * @param bits 비트 데이터
 * @param fieldPos 확인하고자 하는 필드 위치
 * @param headerLen 어떤 필드가 존재하는지 알려주는 primary octet 
 * @returns fieldPos의 비트가 켜져있는지
 */
const isBitSet = (bits: number, fieldPos: number, headerLen: number) => {
    const totalBits = headerLen * 7;

    // fieldPos는 1부터 시작
    const shift = totalBits - fieldPos;

    return (shift >= 0) && ((bits & (1 << shift)) != 0);
}

/**
 * 특정 범위 내부에서 비트가 1인 위치의 값을 전부 합침
 * 시작 인덱스 >= 값 >= 끝 인덱스
 * @param bits 비트 데이터
 * @param startIndex 범위의 시작 인덱스
 * @param endIndex 범위의 끝 인덱스
 * @param pow 계산할 제곱값
 * @returns 범위 값
 */
const octetOfRange = (bits: number, startIndex: number, endIndex: number, pow: number) => {
    let result = 0;
    
    for (let index = startIndex; index >= endIndex; index--, pow--) {
        if ((bits & (1 << index)) !== 0) {
            result |= (1 << pow);
        }
    }

    return result
}

/**
 * 2의 보수 처리
 * @param octets 보수 처리 전의 값
 * @param bitCount 범위 최대치 위치
 * @returns 보수 처리 후 값
 */
const twosCompliment = (octets: number, bitCount: number) => {
    // 최상위 비트를 부호 비트로 식별
    const signBit = 1 << (bitCount - 1);
    // 최대값 범위 계산
    const maxRange = 1 << bitCount;

    // 음수 변환 조건
    // 부호 비트가 1이면 음수로 변환
    return (octets >= signBit) ? (octets - maxRange) : octets;
}

// 배열 선언
const CHAR_ARRAY: (string | undefined)[] = new Array(58);

// 초기화 로직 - A-Z (인덱스 1-26)
const startCharA = 'A'.charCodeAt(0);
for (let i = 1; i <= 26; i++) {
    CHAR_ARRAY[i] = String.fromCharCode(startCharA + i - 1);
}

// 초기화 로직 - 0-9 (인덱스 48-57)
const startChar0 = '0'.charCodeAt(0);
for (let i = 48; i <= 57; i++) {
    CHAR_ARRAY[i] = String.fromCharCode(startChar0 + i - 48);
}

const getChar = (key: number) => {
    // 혹시라도 소수점이 들어올 경우를 대비해 정수로 변환 (Java의 (int)key 대응)
    const intKey = Math.floor(key);

    // 배열 범위 확인
    if (intKey < 0 || intKey >= CHAR_ARRAY.length) {
        return "";
    }

    const result = CHAR_ARRAY[intKey];

    // 할당되지 않은 인덱스(undefined) 처리 (Java의 null 체크 대응)
    if (result === undefined) {
        return "";
    }

    return result;
}

export { isBitSet, octetOfRange, twosCompliment, getChar }