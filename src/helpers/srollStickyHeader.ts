let previousScrollPosition = 0;
let header: null | HTMLElement = null;

export const scrollStickyHeader = () => {
    if (typeof window !== 'undefined') {
        header = document.querySelector<HTMLElement>('.js-header');
    }

    let goingDown = false;

    if (!header) return;

    if (window.scrollY > previousScrollPosition) {
        goingDown = true;
        document.body.setAttribute('data-scroll-direction', 'down');

        if (window.scrollY > header.clientHeight) {
            header.classList.add('m-hidden');
        }
        if (window.scrollY > header.clientHeight + 20) {
            header.classList.add('m-top');
        }
        if (header.classList.contains('m-top')) {
            header.classList.add('m-hidden');
        }

        header.classList.remove('m-sticky');
    } else {
        document.body.setAttribute('data-scroll-direction', 'up');

        if (window.scrollY < 20) {
            header.classList.remove('m-top');
        }
        if (window.scrollY <= 0) {
            header.classList.remove('m-sticky');
        } else {
            if (header.classList.contains('m-top')) {
                header.classList.add('m-sticky');
            }

            header.classList.remove('m-hidden');
        }
    }

    previousScrollPosition = window.scrollY;

    return goingDown;
};
