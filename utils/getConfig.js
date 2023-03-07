function getConfig() {
    let bili;
    try {
        bili = JSON.parse(process.env.BILI_CONFIG);
    } catch (error) {
        console.error('Error: config wrong json format');
        return {};
    }

    const result = {}
    for (key of Object.keys(bili)) {
        const uids = bili[key].split(',');
        for (uid of uids) {
            if (uid in result)
                result[uid].push(key);
            else
                result[uid] = [key];
        }
    }

    if (Object.keys(result).length * 1000 > process.env.UPD_INTERVAL) {
        console.error('Error: update interval too short');
        return {};
    }
    return result;
}

module.exports = { getConfig };