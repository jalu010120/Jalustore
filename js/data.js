// js/data.js

const deliveryData = [
    // Orderan Berjalan
    { slot: 1, name: 'Ney', order: 5000, send: 3270 }, // Updated
    { slot: 1, name: 'Nayla', order: 530, send: 518 }, // Updated
    { slot: 1, name: 'Aelia', order: 840, send: 440 }, // Updated
    { slot: 1, name: 'Raine', order: 420, send: 320 }, // Updated
    { slot: 1, name: 'Aya', order: 860, send: 340 }, // Updated
    { slot: 1, name: 'Anna', order: 1080, send: 80 }, // Updated

    { slot: 2, name: 'Angel2', order: 600, send: 500 }, // Updated, status ❌ removed
    { slot: 2, name: 'Rani', order: 320, send: 300, statusOverride: 'fail' }, // Status ❌ retained
    { slot: 2, name: 'Autumn', order: 850, send: 230, statusOverride: 'fail' }, // Status ❌ retained
    { slot: 2, name: 'Ave', order: 220, send: 100 }, // Updated

    { slot: 3, name: 'Zee', order: 220, send: 120 }, // Updated
    { slot: 3, name: 'Diyy', order: 320, send: 300 }, // Updated
    { slot: 3, name: 'Aze', order: 570, send: 340, statusOverride: 'fail' }, // Status ❌ retained
    { slot: 3, name: 'Al', order: 320, send: 220 }, // Updated, status ❌ removed
    { slot: 3, name: 'Sena', order: 570, send: 380 }, // Updated
    { slot: 3, name: 'Araba', order: 150, send: 141, statusOverride: 'fail' }, // Status ❌ added
    { slot: 3, name: 'Idnes', order: 320, send: 185 }, // Updated
    { slot: 3, name: 'Luna', order: 800, send: 731 }, // Updated, status ❌ removed
    { slot: 3, name: 'Kai', order: 220, send: 80, statusOverride: 'fail' }, // Status ❌ added
    { slot: 3, name: 'Rei', order: 220, send: 100 }, // Updated
    { slot: 3, name: 'Tsabyy', order: 100, send: 40 }, // Updated

    // Riwayat Orderan Selesai
    { slot: 'completed', name: 'Purili', order: 320, send: 320 },
    { slot: 'completed', name: 'Rain', order: 320, send: 320 },
    { slot: 'completed', name: 'Alip', order: 320, send: 320 }, // New completed buyer
    { slot: 'completed', name: 'Anggi', order: 320, send: 320 }, // New completed buyer
    { slot: 'completed', name: 'Hira', order: 360, send: 377 },
    { slot: 'completed', name: 'Amanda', order: 80, send: 80 },
    { slot: 'completed', name: 'bulilisso', order: 80, send: 80 },
    { slot: 'completed', name: 'Tsabyy', order: 200, send: 200 },
    { slot: 'completed', name: 'Harbie', order: 200, send: 200 },
    { slot: 'completed', name: 'Fida', order: 100, send: 103 },
    { slot: 'completed', name: 'Vyan', order: 80, send: 83 },
    { slot: 'completed', name: 'Ayu', order: 1000, send: 1003 },
    { slot: 'completed', name: 'Anna', order: 600, send: 603 },
    { slot: 'completed', name: 'Zee', order: 150, send: 153 },
    { slot: 'completed', name: 'Nanda', order: 210, send: 213 },
    { slot: 'completed', name: 'Alvin', order: 210, send: 213 },
    { slot: 'completed', name: 'Ira', order: 150, send: 153 },
    { slot: 'completed', name: 'Kael', order: 120, send: 123 },
    { slot: 'completed', name: 'Xen', order: 210, send: 213 },
    { slot: 'completed', name: 'Lusi', order: 600, send: 603 },
    { slot: 'completed', name: 'Sea', order: 150, send: 157 }
];
