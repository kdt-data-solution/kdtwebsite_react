export class Dropdown {
  constructor(question, answer) {
    this.question = question;
    this.answer = answer;
    this.isOpen = false;
  }

  render() {
    return `
      <div class="mb-2 rounded-md overflow-hidden bg-foreground">
        <button class="dropdown-toggle w-full text-background text-left py-3 sm:py-4 px-4 sm:px-6 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-0 active:outline-none bg-transparent border-0" style="-webkit-tap-highlight-color: transparent;">
          <span class="font-medium text-background text-xs sm:text-sm md:text-base">${this.question}</span>
          <svg class="dropdown-icon w-4 h-4 sm:w-5 sm:h-5 text-background transition-transform duration-300 ease-in-out flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div class="dropdown-content text-background overflow-hidden transition-[max-height] duration-500 ease-in-out" style="max-height: 0px;">
          <div class="px-4 sm:px-6 pb-3 sm:pb-4 pt-0 text-[11px] sm:text-xs md:text-sm">${this.answer}</div>
        </div>
      </div>
    `;
  }

  static initializeDropdowns() {
    const buttons = document.querySelectorAll('.dropdown-toggle');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('.dropdown-icon');
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        buttons.forEach(otherBtn => {
          if (otherBtn !== this) {
            const otherContent = otherBtn.nextElementSibling;
            const otherIcon = otherBtn.querySelector('.dropdown-icon');
            otherContent.style.maxHeight = '0px';
            otherIcon.classList.remove('rotate-180');
          }
        });

        if (isOpen) {
          content.style.maxHeight = '0px';
          icon.classList.remove('rotate-180');
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
          icon.classList.add('rotate-180');
        }
      });
    });
  }
}
