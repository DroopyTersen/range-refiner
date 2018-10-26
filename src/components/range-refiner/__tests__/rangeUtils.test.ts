import { 
    sortRefinerValues, 
    RefinerValue, 
    getMinMaxValues, 
    getSlices, 
    setSliceHeights 
} from "../rangeUtils";

const getBasicValues = () : RefinerValue[] => [ 
    { value: 10, count: 1 }, 
    { value: 1, count: 1 }, 
    { value: 2, count: 1 }
];

const getNegativeValues = () : RefinerValue[] => [ 
    { value: -10, count: 1 }, 
    { value: 1, count: 1 }, 
    { value: -2, count: 1 }
];

describe("rangeUtils.sortRefinerValues()", () => {

    test("Should be immutable", () => {
        let values = getBasicValues();
        let initialValueString = JSON.stringify(values);
        let sortedValues = sortRefinerValues(values);
        let postSortValueString = JSON.stringify(values);
        expect(values).not.toBe(sortedValues);
        expect(initialValueString).toBe(postSortValueString);
    })

    test("Should be sorted ascending", () => {
        let values = getBasicValues();
        let sortedValues = sortRefinerValues(values);
        for(var i = 1; i < sortedValues.length; i++) {
            expect(sortedValues[i].value)
                .toBeGreaterThanOrEqual(sortedValues[i-1].value)
        }
    });

    test("Should handle negative numbers", () => {
        let values = getNegativeValues();
        let sortedValues = sortRefinerValues(values);
        for(var i = 1; i < sortedValues.length; i++) {
            expect(sortedValues[i].value)
                .toBeGreaterThanOrEqual(sortedValues[i-1].value)
        }
    })
});

describe("rangeUtils.getMinMaxValues()", () => {
    test("Should return null for empty array", () => {
        let values = [];
        let minMax = getMinMaxValues(values);
        expect(minMax).toBeNull;
    })

    test("Should return null for invalid array", () => {
        let values = undefined;
        let minMax = getMinMaxValues(values);
        expect(minMax).toBeNull;
    })

    test("Should return {min,max}", () => {
        let values = [ 
            { value: 10, count: 1 }, 
            { value: 1, count: 1 }, 
            { value: 2, count: 1 }
        ]
        let minMax = getMinMaxValues(values);
        expect(minMax.min).toBe(1);
        expect(minMax.max).toBe(10);
    })

    test("Should handle negative numbers", () => {
        let values = [ 
            { value: -10, count: 1 }, 
            { value: 1, count: 1 }, 
            { value: -2, count: 1 }
        ]
        let minMax = getMinMaxValues(values);
        expect(minMax.min).toBe(-10);
        expect(minMax.max).toBe(1);
    })
})

describe("rangeUtils.getSlices()", () => {
    test("Should return with the specified number of slices", async () => {
        let values = getBasicValues();
        let slices = getSlices(values, 3);
        expect(slices.length).toBe(3);
    })

    test("Should slice up evenly divisible values", () => {
        let values = [ 
            { value: 0, count: 1 }, 
            { value: 10, count: 1 }, 
            { value: 5, count: 1 }
        ]
        let slices = getSlices(values, 2);
        expect(slices.length).toBe(2);
        expect(slices[0].min).toBe(0);
        expect(slices[0].max).toBe(5);
        expect(slices[1].min).toBe(5);
        expect(slices[1].max).toBe(10);
    })
    test("Should slice up evenly with remainder", () => {
        let values = [ 
            { value: 0, count: 1 }, 
            { value: 10, count: 1 }, 
            { value: 5, count: 1 }
        ]
        let slices = getSlices(values, 4);
        expect(slices.length).toBe(4);
        expect(slices[0].min).toBe(0);
        expect(slices[0].max).toBe(2.5);
        expect(slices[1].min).toBe(2.5);
        expect(slices[1].max).toBe(5);
    })

    test("Should be evenly sliced", () => {
        let values = getBasicValues();
        let slices = getSlices(values, 3);
        for(var i = 1; i < slices.length; i++) {
            let currentDifference = slices[i].max - slices[i].min
            let prevDifference = slices[i - 1].max - slices[i -1].min
            let variance = Math.abs(currentDifference - prevDifference);
            expect(variance).toBeLessThan(1);
        }
    })

    test("Should leave no gaps", () => {
        let values = [ 
            { value: 10, count: 1 }, 
            { value: 1, count: 1 }, 
            { value: 2, count: 1 }
        ];
        let slices = getSlices(values, 3);
        for(var i = 1; i < slices.length; i++) {
            let currentMin = slices[i].min
            let prevMax = slices[i - 1].max
            expect(currentMin).toBe(prevMax);
        }
    })

    test("Should return counts", () => {
        let values = [ 
            { value: 10, count: 1 }, 
            { value: 9, count: 2 }, 
            { value: 1, count: 2 }, 
            { value: .1, count: 1 }, 
            { value: 2, count: 1 }
        ];
        let slices = getSlices(values, 3);
        expect(slices.length).toBe(3);
        expect(slices[0].count).toBe(4);
        expect(slices[1].count).toBe(0);
        expect(slices[2].count).toBe(3);
    })

    test("Should linearly represet data", () => {
        let values = [ 
            { value: 1, count: 25 },
            { value: 5, count: 100 }, 
            { value: 10, count: 50 }, 
        ];
        let slices = getSlices(values, 3);
        setSliceHeights(slices, 100, 0);
        expect(slices[0].height).toBe(25);
        expect(slices[1].height).toBe(100);
        expect(slices[2].height).toBe(50);
    })

    test("Shouldn't exceed max height", () => {
        let values = [ 
            { value: 1, count: 40 },
            { value: 5, count: 100 }, 
            { value: 10, count: 50 }, 
        ];
        let slices = getSlices(values, 3);
        setSliceHeights(slices, 50, 0);
        expect(slices[0].height).toBe(20);
        expect(slices[1].height).toBe(50);
        expect(slices[2].height).toBe(25);
    })

    test("Counts less than 10 shouldn't hit max height", () => {
        let values = [ 
            { value: 1, count: 4 },
            { value: 5, count: 6 }, 
            { value: 10, count: 2 }, 
        ];
        let slices = getSlices(values, 3);
        setSliceHeights(slices, 100, 0);
        expect(slices[0].height).toBe(40);
        expect(slices[1].height).toBe(60);
        expect(slices[2].height).toBe(20);
    })
    test("Should at least have minHeight if there is a count", () => {
        let values = [ 
            { value: 1, count: 50 },
            { value: 5, count: 100 },
            { value: 10, count: 1 }, 
        ];
        let slices = getSlices(values, 3);
        setSliceHeights(slices, 40, 5);
        expect(slices[0].height).toBe(20);
        expect(slices[1].height).toBe(40);
        expect(slices[2].height).toBe(5);
    })
    test("Should have a height of 0 if no count", () => {
        let values = [ 
            { value: 1, count: 0 },
            { value: 5, count: 0 },
            { value: 10, count: 10 }, 
        ];
        let slices = getSlices(values, 3);
        setSliceHeights(slices, 40, 5);
        expect(slices[0].height).toBe(0);
    })
})