document.addEventListener("DOMContentLoaded", () => {
    CustomEase.create("hop", "M0,0 C0,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1");
    CustomEase.create("hop2", "M0,0 C0,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1");

    const splith2 = new SplitType(".site-info h2", { types: "lines" });
    splith2.lines.forEach((line) => {
        const text = line.textContent;
        const wrapper = document.createElement("div");
        wrapper.className = "line";
        const span = document.createElement("span");
        span.textContent = text;
        wrapper.appendChild(span);
        line.parentNode.replaceChild(wrapper, line);
    });

    const maintl = gsap.timeline();
    const revealertl = gsap.timeline();
    const scaletl = gsap.timeline();

    revealertl
        .to(".revealer_r-1", {
            clipPath: "polygon(0% 0%,100% 0%, 100% 0%, 0% 0%)",
            duration: 1.5,
            ease: "hop"
        })
        .to(".revealer_r-2", {
            clipPath: "polygon(0% 100%,100% 0%, 100% 0%, 0% 100%)",
            duration: 1.5,
            ease: "hop"
        }, "<");

    scaletl.to(".img:first-child", {
        scale: 1,
        duration: 2,
        ease: "power4.inOut"
    });

    const images = document.querySelectorAll(".img:not(:first-child)");
    images.forEach((img) => {
        scaletl.to(img, {
            opacity: 1,
            scale: 1,
            duration: 1.25,
            ease: "power3.out"
        }, ">-0.5");
    });

    maintl
        .add(revealertl)
        .add(scaletl, "-=1.25")
        .add(() => {
            document.querySelectorAll(".img:not(.img_main)").forEach((img) => img.remove());
            const state = Flip.getState(".img_main");
            document.querySelector(".images").classList.add("stacked-container");
            document.querySelectorAll(".img_main").forEach((img, i) => {
                img.classList.add("stacked");
                img.style.order = i;
                gsap.set(".img.stacked", { clearProps: "transform, top, left" });
            });
            return Flip.from(state, {
                duration: 2,
                ease: "hop",
                absolute: true,
                stagger: { amount: -0.3 }
            });
        })
        .to(".word h1, .nav-item p, .line p, .site-info h2 .line span", {
            y: 0,
            duration: 3,
            ease: "hop2",
            stagger: 0.1,
            delay: 1.25
        })
        .to(".cover-img", {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            duration: 2,
            ease: "hop",
            delay: -4.75
        });
});
