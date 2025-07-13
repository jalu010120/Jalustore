// js/data.js

const deliveryData = [
    // Orderan Berjalan
    { slot: 1, name: 'Ney', order: 4340, send: 3250 }, // Updated
    { slot: 1, name: 'Nayla', order: 530, send: 498 }, // Updated
    { slot: 1, name: 'Aelia', order: 840, send: 420 }, // Updated
    { slot: 1, name: 'Raine', order: 420, send: 300 }, // Updated
    { slot: 1, name: 'Aya', order: 860, send: 300 }, // Updated
    { slot: 1, name: 'Anna', order: 1080, send: 60 }, // Updated

    { slot: 2, name: 'Isa', order: 800, send: 160 }, // Updated
    { slot: 2, name: 'Angel2', order: 600, send: 480 }, // Updated, status ❌ removed
    { slot: 2, name: 'Alip', order: 320, send: 300 }, // Updated
    { slot: 2, name: 'Rani', order: 320, send: 300 }, // Updated, status ❌ removed
    { slot: 2, name: 'Anggi', order: 320, send: 300 }, // Updated
    { slot: 2, name: 'Autumn', order: 850, send: 230, statusOverride: 'fail' }, // Status ❌ retained
    { slot: 2, name: 'Ave', order: 220, send: 80 }, // Updated

    { slot: 3, name: 'Zee', order: 220, send: 100 }, // Updated
    { slot: 3, name: 'Diyy', order: 320, send: 280 }, // Updated
    { slot: 3, name: 'Aze', order: 570, send: 340 }, // Updated, status ❌ removed
    { slot: 3, name: 'Al', order: 320, send: 200, statusOverride: 'fail' }, // Status ❌ retained
    { slot: 3, name: 'Sena', order: 570, send: 360 }, // Updated
    { slot: 3, name: 'Araba', order: 150, send: 141 }, // Updated
    { slot: 3, name: 'Idnes', order: 320, send: 176 }, // Updated
    { slot: 3, name: 'Luna', order: 800, send: 722, statusOverride: 'fail' }, // Status ❌ retained
    { slot: 3, name: 'Kai', order: 220, send: 80 }, // Updated
    { slot: 3, name: 'Rei', order: 220, send: 80 }, // Updated
    { slot: 3, name: 'Tsabyy', order: 100, send: 20 }, // New buyer added (different from completed Tsabyy)

    // Riwayat Orderan Selesai (Dipertahankan dari update sebelumnya, Purili dan Rain ditambahkan)
    { slot: 'completed', name: 'Purili', order: 320, send: 320 }, // New completed buyer
    { slot: 'completed', name: 'Rain', order: 320, send: 320 }, // New completed buyer
    { slot: 'completed', name: 'Hira', order: 360, send: 377 },
    { slot: 'completed', name: 'Amanda', order: 80, send: 80 },
    { slot: 'completed', name: 'bulilisso', order: 80, send: 80 },
    { slot: 'completed', name: 'Tsabyy', order: 200, send: 200 }, // This is the old 'Tsabyy' from completed
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
