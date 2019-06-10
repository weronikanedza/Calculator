export const validateMask = mask => {
    let maskCalc;
    if (mask < 3) {
        maskCalc = parseInt(mask);
        return maskCalc < 1 || maskCalc > 24 ? false : true;
    }

    return mask.test(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/);
};
