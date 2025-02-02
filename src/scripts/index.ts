// OS識別用
let os: string;

let _degrees: number;

// DOM構築完了イベントハンドラ登録
window.addEventListener("DOMContentLoaded", init);

// 初期化
function init(): void {
    os = detectOSSimply();
    console.log(`OS: ${os}`);
    if (os === "iphone") {
        const permitButton = document.querySelector("#permit");
        if (permitButton) {
            permitButton.addEventListener("click", permitDeviceOrientationForSafari);
        }
    }

    const answerButton = document.querySelector("#button");
    if (answerButton) {
        answerButton.addEventListener("click", answer);
    }
    addEventListener("deviceorientation", orientation, true);
}

// ジャイロスコープと地磁気をセンサーから取得
function orientation(event: DeviceOrientationEvent): void {
    if (!event.alpha || !event.beta || !event.gamma) return;

    const degrees = event.absolute
        ? (event as any).webkitCompassHeading ?? compassHeading(event.alpha, event.beta, event.gamma)
        : compassHeading(event.alpha, event.beta, event.gamma);

    _degrees = degrees;

    // let direction: string;
    // if ((degrees > 337.5 && degrees < 360) || (degrees > 0 && degrees < 22.5)) {
    //     direction = "北";
    // } else if (degrees > 22.5 && degrees < 67.5) {
    //     direction = "北東";
    // } else if (degrees > 67.5 && degrees < 112.5) {
    //     direction = "東";
    // } else if (degrees > 112.5 && degrees < 157.5) {
    //     direction = "東南";
    // } else if (degrees > 157.5 && degrees < 202.5) {
    //     direction = "南";
    // } else if (degrees > 202.5 && degrees < 247.5) {
    //     direction = "南西";
    // } else if (degrees > 247.5 && degrees < 292.5) {
    //     direction = "西";
    // } else {
    //     direction = "北西";
    // }
}

// 端末の傾き補正（Android用）
// https://www.w3.org/TR/orientation-event/
function compassHeading(alpha: number, beta: number, gamma: number): number {
    const degtorad = Math.PI / 180; // Degree-to-Radian conversion

    const _x = beta ? beta * degtorad : 0; // beta value
    const _y = gamma ? gamma * degtorad : 0; // gamma value
    const _z = alpha ? alpha * degtorad : 0; // alpha value

    const cX = Math.cos(_x);
    const cY = Math.cos(_y);
    const cZ = Math.cos(_z);
    const sX = Math.sin(_x);
    const sY = Math.sin(_y);
    const sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    const Vx = -cZ * sY - sZ * sX * cY;
    const Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    let compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
        compassHeading += Math.PI;
    } else if (Vx < 0) {
        compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}

// 簡易OS判定
function detectOSSimply(): string {
    if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") || navigator.userAgent.includes("iPod")) {
        return "iphone";
    } else if (navigator.userAgent.includes("Android")) {
        return "android";
    } else {
        return "pc";
    }
}

// iPhone + Safari の場合は DeviceOrientation API の使用許可を求める
function permitDeviceOrientationForSafari(): void {
    (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
            if (response === "granted") {
                window.addEventListener("deviceorientation", orientation, true);
            }
        })
        .catch(console.error);
}

function answer() {
    // alert(_degrees + ", 誤差：" + (_degrees - 247.5));
    const result = document.querySelector("#result");
    if (result)
        result.textContent = String(_degrees - 247.5);
}
