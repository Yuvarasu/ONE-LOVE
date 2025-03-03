document.addEventListener("DOMContentLoaded", () => {
    // Create custom easing curves using GSAP's CustomEase
    CustomEase.create("hop", "M0,0 C0,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1");
    CustomEase.create("hop2", "M0,0 C0,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1");

    // Splitting <h2> text into separate lines using SplitType
    const splith2 = new SplitType(".site-info h2", { types: "lines" });
    
    // Wrapping each split line inside a <div class="line"> for styling or animations
    splith2.lines.forEach((line) => {
        const text = line.textContent;
        const wrapper = document.createElement("div");
        wrapper.className = "line";
        const span = document.createElement("span");
        span.textContent = text;
        wrapper.appendChild(span);
        line.parentNode.replaceChild(wrapper, line);
    });

    // Initialize GSAP timelines
    const maintl = gsap.timeline(); // Main timeline for animations
    const revealertl = gsap.timeline(); // Timeline for reveal animations
    const scaletl = gsap.timeline(); // Timeline for scaling animations

    // Animation for revealing elements with clip-path transitions
    revealertl
        .to(".revealer_r-1", {
            clipPath: "polygon(0% 0%,100% 0%, 100% 0%, 0% 0%)", // Animates clip-path from full to none
            duration: 1.5,
            ease: "hop" // Uses custom easing curve
        })
        .to(".revealer_r-2", {
            clipPath: "polygon(0% 100%,100% 0%, 100% 0%, 0% 100%)",
            duration: 1.5,
            ease: "hop"
        }, "<"); // Runs this animation at the same time as the previous one

    // Scale up the first image smoothly
    scaletl.to(".img:first-child", {
        scale: 1.05,
        duration: 2,
        ease: "power4.inOut"
    });

    // Fade in and scale other images one by one
    const images = document.querySelectorAll(".img:not(:first-child)");
    images.forEach((img) => {
        scaletl.to(img, {
            opacity: 1,
            scale: 1,
            duration: 1.25,
            ease: "power3.out"
        }, ">-0.5"); // Starts this animation 0.5s before the previous one ends
    });

    // Main timeline sequence
    maintl
        .add(revealertl) // Add reveal animation first
        .add(scaletl, "-=1.25") // Add scaling animation, overlapping by 1.25s
        .add(() => {
            // Remove all non-main images after animation completes
            document.querySelectorAll(".img:not(.img_main)").forEach((img) => img.remove());
            
            // Capture the current state of .img_main elements for a smooth transition
            const state = Flip.getState(".img_main");
            
            // Add the 'stacked-container' class to .images
            document.querySelector(".images").classList.add("stacked-container");
            
            // Stack the images by adding 'stacked' class and setting order
            document.querySelectorAll(".img_main").forEach((img, i) => {
                img.classList.add("stacked");
                img.style.order = i;
                img.style.position = "absolute"; // Ensures stacking behavior
                img.style.top = "0";
                img.style.left = "0";
            });
            
            // Animate the stacked images back to their final positions
            return Flip.from(state, {
                duration: 2,
                ease: "hop",
                absolute: true,
                stagger: { amount: -0.3 } // Stagger effect for better transition
            });
        })
        // Animate text elements by moving them into view
        .to(".word h1, .nav-item p, .line p, .site-info h2 .line span", {
            y: 0, // Moves elements to their final position
            duration: 3,
            ease: "hop2",
            stagger: 0.1, // Staggers animation by 0.1s per element
            delay: 1.25 // Delays animation start
        })
        // Animate the cover image to reveal content
        .to(".cover-img", {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            duration: 2,
            ease: "hop",
            delay: -4.75 // Starts before the previous animation ends
        });
});
