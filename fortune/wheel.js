const wheelRoot = document.getElementById("fortuneWheel");
const wheelList = document.getElementById("wheelItems");
const spinBtn = document.getElementById("spinBtn");
const tickSound = document.getElementById("tickSound");

let items = [];
let spinning = false;
let spinAnimation = null;
let previousEndDegree = 0;
let tickRaf = null;
let lastTickIndex = -1;
let isDragging = false;
let activePointerId = null;
let dragLastAngleDeg = 0;
let dragRotationDeg = 0;
let dragSamples = [];

function normalizeDegrees(value) {
    return ((value % 360) + 360) % 360;
}

function indexFromDegree(degree) {
    if (!items.length) return 0;
    const normalized = normalizeDegrees(degree);
    const adjusted = (360 - normalized) % 360;
    const segment = 360 / items.length;
    return Math.floor(adjusted / segment) % items.length;
}

function getRenderedRotationDeg() {
    const transform = getComputedStyle(wheelList).transform;
    if (!transform || transform === "none") {
        return previousEndDegree;
    }

    const matrix = new DOMMatrixReadOnly(transform);
    return (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
}

function playTick() {
    if (navigator.vibrate) {
        try {
            navigator.vibrate(10);
        } catch (e) {}
    }
    if (!tickSound) return;
    tickSound.play().catch(() => {
        // Ignore autoplay restrictions; interaction is user-driven.
    });
}

function shortestAngleDelta(from, to) {
    return ((to - from + 540) % 360) - 180;
}

function pointAngleDeg(clientX, clientY) {
    const rect = wheelList.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
}

function setWheelRotation(degree) {
    wheelList.style.transform = `rotate(${degree}deg)`;
}

function stopTickMonitor() {
    if (tickRaf) {
        cancelAnimationFrame(tickRaf);
        tickRaf = null;
    }
}

function beginTickMonitor() {
    stopTickMonitor();
    monitorTicks();
}

function cancelSpinAnimation() {
    if (!spinAnimation) return;
    const current = getRenderedRotationDeg();
    spinAnimation.onfinish = null;
    spinAnimation.oncancel = null;
    spinAnimation.cancel();
    spinAnimation = null;
    previousEndDegree = current;
    setWheelRotation(previousEndDegree);
    spinning = false;
    spinBtn.disabled = false;
    stopTickMonitor();
}

function animateSpinTo(targetDegree, duration, easing) {
    spinning = true;
    spinBtn.disabled = true;
    lastTickIndex = indexFromDegree(previousEndDegree);

    const diff = targetDegree - previousEndDegree;
    // Calculate a realistic overshoot proportional to the spin distance
    const overshootAmount = Math.min(12, Math.max(3, Math.abs(diff) * 0.006)) * Math.sign(diff);
    const overshootDegree = targetDegree + overshootAmount;
    const recoilDegree = targetDegree - overshootAmount * 0.25;

    spinAnimation = wheelList.animate(
        [
            { transform: `rotate(${previousEndDegree}deg)`, offset: 0 },
            { transform: `rotate(${overshootDegree}deg)`, offset: 0.82, easing: easing || "cubic-bezier(0.25, 1, 0.5, 1)" },
            { transform: `rotate(${recoilDegree}deg)`, offset: 0.92, easing: "ease-in-out" },
            { transform: `rotate(${targetDegree}deg)`, offset: 1, easing: "ease-in-out" }
        ],
        {
            duration,
            fill: "forwards",
            iterations: 1
        }
    );

    beginTickMonitor();

    spinAnimation.onfinish = () => {
        stopTickMonitor();
        spinAnimation = null;
        spinning = false;
        previousEndDegree = targetDegree;
        setWheelRotation(previousEndDegree);
        spinBtn.disabled = false;
    };

    spinAnimation.oncancel = () => {
        stopTickMonitor();
        spinAnimation = null;
        spinning = false;
        spinBtn.disabled = false;
    };
}

function monitorTicks() {
    if (!spinning) return;

    const currentIndex = indexFromDegree(getRenderedRotationDeg());
    if (currentIndex !== lastTickIndex) {
        playTick();
        lastTickIndex = currentIndex;
    }

    tickRaf = requestAnimationFrame(monitorTicks);
}

function initWheel(list) {
    items = list.slice();
    wheelRoot.style.setProperty("--_items", items.length);
    wheelList.innerHTML = "";

    items.forEach((item, i) => {
        const li = document.createElement("li");
        li.style.setProperty("--_idx", i + 1);
        li.textContent = item;
        wheelList.appendChild(li);
    });

    cancelSpinAnimation();
    stopTickMonitor();

    spinning = false;
    previousEndDegree = 0;
    lastTickIndex = -1;
    setWheelRotation(0);
    spinBtn.disabled = false;
}

function spin() {
    if (spinning || isDragging || items.length < 2) return;

    cancelSpinAnimation();

    const spinDegrees = 1800 + Math.random() * 1440;
    const newEndDegree = previousEndDegree + spinDegrees;

    animateSpinTo(newEndDegree, 4200, "cubic-bezier(0.22, 1, 0.36, 1)");
}

function handlePointerDown(event) {
    if (items.length < 2 || spinning || event.target === spinBtn) return;

    cancelSpinAnimation();

    isDragging = true;
    activePointerId = event.pointerId;
    dragLastAngleDeg = pointAngleDeg(event.clientX, event.clientY);
    dragRotationDeg = previousEndDegree;
    dragSamples = [{ time: performance.now(), rotation: dragRotationDeg }];
    lastTickIndex = indexFromDegree(dragRotationDeg);
    wheelRoot.classList.add("is-dragging");
    wheelRoot.setPointerCapture(event.pointerId);
}

function handlePointerMove(event) {
    if (!isDragging || event.pointerId !== activePointerId) return;

    const currentAngleDeg = pointAngleDeg(event.clientX, event.clientY);
    const deltaDeg = shortestAngleDelta(dragLastAngleDeg, currentAngleDeg);
    dragRotationDeg += deltaDeg;
    dragLastAngleDeg = currentAngleDeg;
    previousEndDegree = dragRotationDeg;
    setWheelRotation(dragRotationDeg);

    const currentIndex = indexFromDegree(dragRotationDeg);
    if (currentIndex !== lastTickIndex) {
        playTick();
        lastTickIndex = currentIndex;
    }

    const now = performance.now();
    dragSamples.push({ time: now, rotation: dragRotationDeg });
    dragSamples = dragSamples.filter(sample => now - sample.time <= 180);
}

function handlePointerUpOrCancel(event) {
    if (!isDragging || event.pointerId !== activePointerId) return;

    isDragging = false;
    activePointerId = null;
    wheelRoot.classList.remove("is-dragging");
    if (wheelRoot.hasPointerCapture(event.pointerId)) {
        wheelRoot.releasePointerCapture(event.pointerId);
    }

    const samples = dragSamples;
    dragSamples = [];
    if (samples.length < 2) return;

    const first = samples[0];
    const last = samples[samples.length - 1];
    const deltaTime = last.time - first.time;
    if (deltaTime <= 0) return;

    const velocityDegPerMs = (last.rotation - first.rotation) / deltaTime;
    if (Math.abs(velocityDegPerMs) < 0.03) return;

    const projectedDegrees = Math.max(
        280,
        Math.min(2800, Math.abs(velocityDegPerMs) * 5600)
    );
    const targetDegree = previousEndDegree + Math.sign(velocityDegPerMs) * projectedDegrees;
    const duration = Math.max(900, Math.min(3000, Math.abs(velocityDegPerMs) * 5200));

    animateSpinTo(targetDegree, duration, "cubic-bezier(0.18, 0.84, 0.28, 1)");
}

spinBtn.onclick = spin;
wheelRoot.addEventListener("pointerdown", handlePointerDown);
wheelRoot.addEventListener("pointermove", handlePointerMove);
wheelRoot.addEventListener("pointerup", handlePointerUpOrCancel);
wheelRoot.addEventListener("pointercancel", handlePointerUpOrCancel);
