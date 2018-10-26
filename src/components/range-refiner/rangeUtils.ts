
export interface RefinerValue {
    value: number,
    count: number,
}

export interface RangeSlice {
    min: number, 
    max: number,
    count: number,
    height?: number,
}
export const sortRefinerValues = function(values:RefinerValue[]) : RefinerValue[] {
    if (!values) return [];
    return values.slice().sort((a, b) => {
        if (a.value == b.value) return 0;
        return a.value < b.value ? -1 : 1
    });
}

export const getMinMaxValues = function(values:RefinerValue[]): { min: number, max: number } {
    if (!values || !values.length) return null;
    let sorted = sortRefinerValues(values);
    return {
        min: sorted[0].value,
        max: sorted[sorted.length - 1].value
    }
}

const findProperSlice = function(slices: RangeSlice[], refinerValue:RefinerValue) : RangeSlice {
    return slices.find(slice => slice.min <= refinerValue.value && slice.max > refinerValue.value);
}

export const getSlices = function(values:RefinerValue[], numSlices:number) : RangeSlice[] {
    let minMax = getMinMaxValues(values);
    let range = (minMax.max - minMax.min)
    let sliceSize = range / numSlices;

    let slices : RangeSlice[] = [];
    for (var i = 0; i < numSlices; i++) {
        let min =  minMax.min + (sliceSize * i)
        slices[i] = {
            min,
            max: min + (sliceSize),
            count: 0,
            height: 0,
        }
    }
    values.forEach(refinerValue => {
        let targetSlice = findProperSlice(slices, refinerValue);
        if (!targetSlice) targetSlice = slices[slices.length - 1];
        if (targetSlice) {
            targetSlice.count = targetSlice.count + refinerValue.count;
        }
    })
    return slices;
}

export const setSliceHeights = function(slices:RangeSlice[], maxHeight = 50, minHeight = 3) {
    let counts = slices.map(slice => slice.count);
    let maxCount = Math.max(...counts)
    if (maxCount < 10) maxCount = 10;
    slices.forEach(slice => {
        slice.height = maxHeight * slice.count / maxCount
        if (slice.count && slice.height < minHeight) slice.height = minHeight
    })
    return slices;
}