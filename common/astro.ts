// usage: setupDayNightTriggers().catch(console.error);

export async function isNightTime(): Promise<boolean> {
    const night = await getAstroDate('night');
    const nightEnd = await getAstroDate('nightEnd');
    const now = new Date();

    // Check if current time is between night and nightEnd
    if (now >= night && now <= nightEnd) {
        return false;
    } else {
        return true;
    }
}

// Function to set up the triggers
export async function setupDayNightTriggers() {
    // Trigger at the start of the night
    on(`astro.night`, async () => {
        console.log('Night has started');
        await isNightTime();
    });

    // Trigger at the end of the night (start of the day)
    on(`astro.nightEnd`, async () => {
        console.log('Day has started');
        await isNightTime();
    });
}
