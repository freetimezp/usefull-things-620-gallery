gsap.registerPlugin(Observer);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const slicesPerCard = 120;
const gap = 0.18;
const normalSpeed = 0.01;

const artists = [
    {
        name: "Elena Marchetti",
        role: "Artist",
        photo: "QmeNv2RoYW42tJuohF9cBemdKZ5gU7ScLMrD3GVBn9CrUP",
    },
    {
        name: "Kofi Mensah",
        role: "Curator",
        photo: "QmdLGVKWQMu2kmADw32js2eN3Tcj856oFfiEWdYeEZbvaP",
    },
    {
        name: "Ines Laurent",
        role: "Painter",
        photo: "QmdpN5pdZeFxPk9vYtvZ8yzbbdHFAU9y4n67fyjTxQ8SP2",
    },
    {
        name: "Julian Hart",
        role: "Sculptor",
        photo: "QmUhyQ2mqsc7H7wragKMiaoodQN4qQBhN8cSga1fM416gv",
    },
    {
        name: "Mei Tanaka",
        role: "Illustrator",
        photo: "QmSKK8QWwSb3bRhpMBKGCzmcCpV2CAJhy53braMdEt1oCR",
    },
    {
        name: "Omar Haddad",
        role: "Photographer",
        photo: "QmWPcoFTrcAbGwks69BYZXVtmqwBcuEPJRBF46c6ispW3F",
    },
    {
        name: "Lina Park",
        role: "Artist",
        photo: "Qmf5Dt5XxvjeKCof2YN9E4HixwT3FwmfzNv32gfUJZdkGB",
    },
    {
        name: "Theo Castell",
        role: "Collector",
        photo: "QmXDg4D8dGdmRvZxohErNnycCDK39nHggzanRaxibacrxY",
    },
];

const ring = {
    angle: 0,
    speed: normalSpeed,
    tilt: -0.28,
};

function createCard(artist) {
    const card = document.createElement("canvas");
    card.width = 1200;
    card.height = 1600;
    const cardCtx = card.getContext("2d");

    const photo = new Image();
    photo.src = `https://assets.lummi.ai/assets/${artist.photo}?w=1120&h=1240&fit=crop&crop=faces`;
    photo.onload = () => {
        cardCtx.fillStyle = "#0b0b0b";
        cardCtx.fillRect(0, 0, 1200, 1600);
        cardCtx.drawImage(photo, 40, 40);

        cardCtx.font = "500 80px Syne";
        cardCtx.fillStyle = "white";
        cardCtx.fillText(artist.name, 40, 1420);

        cardCtx.font = "500 48px Syne";
        cardCtx.fillStyle = "#f26e33";
        cardCtx.fillText(artist.role, 40, 1505);
    };

    return card;
}

function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
}

function pointOnRing(angle, radius) {
    const depth = Math.cos(angle);
    const scale = 1 + depth * 0.25;

    return {
        x: Math.sin(angle) * radius * scale,
        y: depth * radius * 0.2,
        scale: scale,
    };
}

function drawRing(side) {
    const radius = Math.min(canvas.width * 0.4, canvas.height * 0.5);
    const slotAngle = (Math.PI * 2) / cards.length;
    const cardAngle = slotAngle * (1 - gap);
    const sliceAngle = cardAngle / slicesPerCard;
    const cardHeight = radius * cardAngle * 1.33;

    cards.forEach((card, cardIndex) => {
        const sliceWidth = card.width / slicesPerCard;

        for (let slice = 0; slice < slicesPerCard; slice++) {
            const angle =
                ring.angle + cardIndex * slotAngle + slice * sliceAngle;
            const start = pointOnRing(angle, radius);
            const end = pointOnRing(angle + sliceAngle, radius);
            const height = cardHeight * start.scale;
            const top = start.y - height / 2;

            if (side === "front" && end.x > start.x) {
                ctx.drawImage(
                    card,
                    slice * sliceWidth,
                    0,
                    sliceWidth,
                    card.height,
                    start.x,
                    top,
                    end.x - start.x + 1,
                    height,
                );
            }

            if (side === "back" && end.x < start.x) {
                ctx.fillStyle = "#d8d4ce";
                ctx.fillRect(end.x, top, start.x - end.x + 1, height);
            }
        }
    });
}

await document.fonts.load("500 80px Syne");
const cards = artists.map(createCard);

window.addEventListener("resize", resize);
resize();

gsap.ticker.add(() => {
    ring.angle += ring.speed * gsap.ticker.deltaRatio();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height * 0.47);
    ctx.rotate(ring.tilt);
    drawRing("back");
    drawRing("front");
    ctx.restore();
});

gsap.from(ring, { speed: 0.12, duration: 3, ease: "power3.out" });
gsap.to(ring, {
    tilt: -0.12,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
});

Observer.create({
    type: "wheel,touch,pointer",
    preventDefault: true,
    onChange: (self) => {
        const spin = (self.deltaX + self.deltaY) * 0.002;
        gsap.fromTo(
            ring,
            { speed: spin },
            { speed: normalSpeed, duration: 2, overwrite: "auto" },
        );
    },
});
