interface UapdataItem {
    dataItem: string,
    length: number,
}

const CAT021_UAP: Record<number, Record<number, UapdataItem>> = {
    1: {
        1: {
            dataItem: "di010",
            length: 2
        },
        2: {
            dataItem: "di040",
            length: -1
        },
        3: {
            dataItem: "di161",
            length: 2
        },
        4: {
            dataItem: "di015",
            length: 1
        },
        5: {
            dataItem: "di071",
            length: 3
        },
        6: {
            dataItem: "di130",
            length: 6
        },
        7: {
            dataItem: "di131",
            length: 8
        },
    },
    2: {
        1: {
            dataItem: "di072",
            length: 3
        },
        2: {
            dataItem: "di150",
            length: 2
        },
        3: {
            dataItem: "di151",
            length: 2
        },
        4: {
            dataItem: "di080",
            length: 3
        },
        5: {
            dataItem: "di073",
            length: 3
        },
        6: {
            dataItem: "di074",
            length: 4
        },
        7: {
            dataItem: "di075",
            length: 3
        },
    },
    3: {
        1: {
            dataItem: "di076",
            length: 4
        },
        2: {
            dataItem: "di140",
            length: 2
        },
        3: {
            dataItem: "di090",
            length: -1
        },
        4: {
            dataItem: "di210",
            length: 1
        },
        5: {
            dataItem: "di070",
            length: 2
        },
        6: {
            dataItem: "di230",
            length: 2
        },
        7: {
            dataItem: "di145",
            length: 2
        },
    },
    4: {
        1: {
            dataItem: "di152",
            length: 2
        },
        2: {
            dataItem: "di200",
            length: 1
        },
        3: {
            dataItem: "di155",
            length: 2
        },
        4: {
            dataItem: "di157",
            length: 2
        },
        5: {
            dataItem: "di160",
            length: 4
        },
        6: {
            dataItem: "di165",
            length: 2
        },
        7: {
            dataItem: "di077",
            length: 3
        },
    },
    5: {
        1: {
            dataItem: "di170",
            length: 6
        },
        2: {
            dataItem: "di020",
            length: 1
        },
        3: {
            dataItem: "di220",
            length: -1
        },
        4: {
            dataItem: "di146",
            length: 2
        },
        5: {
            dataItem: "di148",
            length: 2
        },
        6: {
            dataItem: "di110",
            length: -1
        },
        7: {
            dataItem: "di016",
            length: 1
        },
    },
    6: {
        1: {
            dataItem: "di008",
            length: 1
        },
        2: {
            dataItem: "di271",
            length: -1
        },
        3: {
            dataItem: "di132",
            length: 1
        },
        4: {
            dataItem: "di250",
            length: -1
        },
        5: {
            dataItem: "di260",
            length: 7
        },
        6: {
            dataItem: "di400",
            length: 1
        },
        7: {
            dataItem: "di295",
            length: -1
        },
    },
    7: {
        1: {
            dataItem: "SPARE",
            length: 0
        },
        2: {
            dataItem: "SPARE",
            length: 0
        },
        3: {
            dataItem: "SPARE",
            length: 0
        },
        4: {
            dataItem: "SPARE",
            length: 0
        },
        5: {
            dataItem: "SPARE",
            length: 0
        },
        6: {
            dataItem: "RE",
            length: -1
        },
        7: {
            dataItem: "SP",
            length: -1
        },
    }
}

export { CAT021_UAP }