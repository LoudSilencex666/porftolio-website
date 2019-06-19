function fakeScroll() {
    let isAnimating = false;
    let scrollPosition = 0;
    let activeSection = 0;
    window.addEventListener('wheel', function(evt) {
        
        if (!isAnimating) {
            isAnimating = true;

            let turn;
            
            if (evt.deltaY > 0) {
                turn = 1;
            } else if (evt.deltaY < 0) {
                turn = -1;
            }

            if (scrollPosition == 0 && turn == -1) {
                scrollPosition = scrollPosition;
                activeSection = activeSection;
            } else if ( scrollPosition == 100/5*4 && turn == 1) {
                scrollPosition = scrollPosition;
                activeSection = activeSection;
            } else {
                scrollPosition += 100/5 * turn;
                activeSection += 1 * turn;
            }
            
            console.log(scrollPosition);
            moveFakeScroll(scrollPosition);
            changeSection(activeSection);
            
            setTimeout(function() {
                isAnimating = false;
            }, 100);
        }

    });
}

function moveFakeScroll(scrollPosition) {
    const element = document.querySelector('.fake-scroll');
    element.style.top = `${scrollPosition}%`;
}

function changeSection(activeSection) {
    const element = document.querySelector('.content-container');
    activeSection = -activeSection;
    element.style.left = `${activeSection * 100}%`;
}