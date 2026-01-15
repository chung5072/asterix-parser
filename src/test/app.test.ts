import { parse } from "../main/app";

test('parse test: record count', () => {
    const records = parse("150006800101");
    
    expect(records.length).toBe(1);
});

test('parse test: specific data item - data item 010', () => {
    const records = parse("150006800101");
    
    const sac = records[0]['021_010_SAC'];
    const sic = records[0]['021_010_SIC'];

    expect(sac).toBe(1);
    expect(sic).toBe(1);
});