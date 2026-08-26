export class Dropdown {
  constructor(question, answer) {
    this.question = question;
    this.answer = answer;
    this.isOpen = false;
  }

  render() {
    const panelId = `faq-${this.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
    return `
      <div class="border-b border-black/20">
        <button class="dropdown-toggle w-full text-gray-950 text-left py-5 sm:py-6 flex justify-between items-center gap-6 cursor-pointer bg-transparent border-0" aria-expanded="false" aria-controls="${panelId}">
          <span class="font-semibold text-base sm:text-lg">${this.question}</span>
          <svg class="dropdown-icon w-5 h-5 text-gray-950 transition-transform duration-300 ease-in-out flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div id="${panelId}" class="dropdown-content text-gray-600 overflow-hidden transition-[max-height] duration-500 ease-in-out" style="max-height: 0px;">
          <div class="pb-5 sm:pb-6 pr-10 text-sm sm:text-base leading-relaxed">${this.answer}</div>
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
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          content.style.maxHeight = '0px';
          icon.classList.remove('rotate-180');
          this.setAttribute('aria-expanded', 'false');
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
          icon.classList.add('rotate-180');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
}
