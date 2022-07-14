
const trackChanges = (originalReservation, updatedReservation) => {

    const changes = {};

    for (const key in originalReservation) {
        if (originalReservation[key] !== updatedReservation[key]) {
            changes[key] = {
                original: originalReservation[key],
                updated: updatedReservation[key]
            };
        }
    }

    return JSON.stringify(changes);

}

module.exports = {
    trackChanges
}

