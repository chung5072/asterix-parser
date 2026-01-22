interface UapdataItem {
    dataItem: string,
    length: number,
}

const CAT062_UAP: Record<number, Record<number, UapdataItem>> = {
    1: {
        1: {
            dataItem: "di010",
            length: 2
        },
        2: {
            dataItem: "SPARE",
            length: 0
        },
        3: {
            dataItem: "di015",
            length: 1
        },
        4: {
            dataItem: "di070",
            length: 3
        },
        5: {
            dataItem: "di105",
            length: 8
        },
        6: {
            dataItem: "di100",
            length: 6
        },
        7: {
            dataItem: "di185",
            length: 4
        },
    },
    2: {
        1: {
            dataItem: "di210",
            length: 2
        },
        2: {
            dataItem: "di060",
            length: 2
        },
        3: {
            dataItem: "di245",
            length: 7
        },
        4: {
            dataItem: "di380",
            length: -1
        },
        5: {
            dataItem: "di040",
            length: 2
        },
        6: {
            dataItem: "di080",
            length: -1
        },
        7: {
            dataItem: "di290",
            length: -1
        },
    },
    3: {
        1: {
            dataItem: "di200",
            length: 1
        },
        2: {
            dataItem: "di295",
            length: -1
        },
        3: {
            dataItem: "di136",
            length: 2
        },
        4: {
            dataItem: "di130",
            length: 2
        },
        5: {
            dataItem: "di135",
            length: 2
        },
        6: {
            dataItem: "di220",
            length: 2
        },
        7: {
            dataItem: "di390",
            length: -1
        },
    },
    4: {
        1: {
            dataItem: "di270",
            length: -1
        },
        2: {
            dataItem: "di300",
            length: 1
        },
        3: {
            dataItem: "di110",
            length: -1
        },
        4: {
            dataItem: "di120",
            length: 2
        },
        5: {
            dataItem: "di510",
            length: -1
        },
        6: {
            dataItem: "di500",
            length: -1
        },
        7: {
            dataItem: "di340",
            length: -1
        },
    },
    5: {
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

export { CAT062_UAP }