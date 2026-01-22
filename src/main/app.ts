import { inputData } from 'asterix-validator';
import { getFieldSpec } from './util/preprocess';
import { cat021VarLen } from './util/varlen/cat021';
import { cat062VarLen } from './util/varlen/cat062';
import { Record, cat021Process } from './util/process/cat021';
import { cat062Process } from './util/process/cat062';

/**
 * Asterix 데이터 파싱
 * @param input 16진수 문자열 데이터
 * @returns 파싱 결과
 */
const parse = (input: string) => {
    // 데이터 확인
    const { category, length, bitArr } = inputData(input); // 카테도리, 데이터 길이, 바이트 값
    
    // 데이터 순회 인덱스
    let pos = 3;

    const records: Record[] = [];
    const record: Record = {};

    // 패킷 데이터 순회
    while (pos < length) {
        const { fieldSpec, recordIndex } = getFieldSpec(category, bitArr, pos);

        // 현재 레코드 안에서 움직일 포인터를 하나 만듭니다.
        let currentPos = recordIndex;

        for (const [dataItem, length] of Object.entries(fieldSpec)) {
            if (dataItem === 'SPARE') {
                // 사용하지 않는 데이터 아이템 넘김
                continue;
            }

            let diLength = 0;

            if (length !== -1) {
                // 고정 길이
                diLength = length;
            } else {
                // 가변 길이
                switch (category) {
                    case 21: {
                        diLength = cat021VarLen(bitArr, currentPos, dataItem);
                        break;
                    }
                    case 62: {
                        diLength = cat062VarLen(bitArr, currentPos, dataItem);
                        break;
                    }
                    default:
                        diLength = 0;
                        break;
                }
            }

            record[dataItem] = diLength;
            
            switch (category) {
                case 21: {
                    cat021Process(record, bitArr, currentPos, dataItem, diLength);
                    break;
                }
                case 62: {
                    cat062Process(record, bitArr, currentPos, dataItem, diLength);
                    break;
                }
                default:
                    break;
            }

            // 포인터 이동
            currentPos += diLength;
        }

        // 다음 레코드는 마지막으로 읽은 위치(currentPos)부터 시작
        pos = currentPos; 
        // 객체 복사 후 삽입
        records.push({ ...record });
    }

    return records;
}

// main test
// console.log(parse("150006800101"));

export { parse }