// js/data.js

const deliveryData = [
    // Slot 1
    { slot: 1, name: 'Ney', order: 5000, send: 3610 },
    { slot: 1, name: 'Aelia', order: 900, send: 800, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 1, name: 'Rezz', order: 350, send: 300 },
    { slot: 1, name: 'Aya', order: 860, send: 780 },
    { slot: 1, name: 'Anna', order: 1080, send: 480 },
    { slot: 1, name: 'Feng', order: 230, send: 180, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 1, name: 'Tuna', order: 360, send: 220 },
    { slot: 1, name: 'Tuna 2', order: 360, send: 120, statusOverride: 'fail' },
    { slot: 1, name: 'Unii', order: 400, send: 20 }, // Pembeli baru

    // Slot 2
    { slot: 2, name: 'Angel2', order: 600, send: 540, statusOverride: 'fail' },
    { slot: 2, name: 'Autumn', order: 850, send: 375, statusOverride: 'fail' },
    { slot: 2, name: 'Rachel', order: 400, send: 260, isSpecial: true }, // Status ❌ sebelumnya dihapus
    { slot: 2, name: 'Honey bear', order: 1400, send: 300 },
    { slot: 2, name: 'Cem', order: 660, send: 220 },
    { slot: 2, name: 'Niz', order: 720, send: 220 },
    { slot: 2, name: 'yulii', order: 400, send: 40 },

    // Slot 3
    { slot: 3, name: 'Diyy', order: 640, send: 620 },
    { slot: 3, name: 'Aze', order: 570, send: 500, statusOverride: 'fail' },
    { slot: 3, name: 'Luna', order: 800, send: 794, statusOverride: 'fail' },
    { slot: 3, name: 'Lili', order: 360, send: 140 },
    { slot: 3, name: 'Yaya', order: 200, send: 160 },
    { slot: 3, name: 'Louis', order: 310, send: 180 },
    { slot: 3, name: 'Onde mande', order: 800, send: 80 }, // Status ❌ sebelumnya dihapus
    { slot: 3, name: 'Lia', order: 400, send: 40 },

    // Riwayat Orderan Selesai
    { slot: 'completed', name: 'Ryu', order: 320, send: 320 }, // Dipindahkan dari Slot 2 (Order = Send)
    { slot: 'completed', name: 'Idnes', order: 320, send: 320 },
    { slot: 'completed', name: 'Risma', order: 120, send: 120 },
    { slot: 'completed', name: 'Alana', order: 320, send: 320 },
    { slot: 'completed', name: 'Zee', order: 400, send: 400 },
    { slot: 'completed', name: 'futaba', order: 140, send: 140 },
    { slot: 'completed', name: 'Sena', order: 570, send: 570 },
    { slot: 'completed', name: 'Al', order: 320, send: 320 },
    { slot: 'completed', name: 'Ave', order: 220, send: 240 },
    { slot: 'completed', name: 'Kai', order: 220, send: 220 },
    { slot: 'completed', name: 'Rei', order: 220, send: 220 },
    { slot: 'completed', name: 'Raine', order: 420, send: 420 },
    { slot: 'completed', name: 'Araba', order: 150, send: 150 },
    { slot: 'completed', name: 'Nayla', order: 530, send: 530 },
    { slot: 'completed', name: 'Rani', order: 320, send: 320 },
    { slot: 'completed', name: 'Purili', order: 320, send: 320 },
    { slot: 'completed', name: 'Rain', order: 320, send: 320 },
    { slot: 'completed', name: 'Alip', order: 320, send: 320 },
    { slot: 'completed', name: 'Anggi', order: 320, send: 320 },
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
