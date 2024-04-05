class Modal {
	constructor(trigger, overlay, content, overlayClass, contentClass) {
		this.trigger = document.querySelector(trigger);
		this.overlay = document.querySelector(overlay);
		this.content = document.querySelector(content);
		this.overlayClass = overlayClass;
		this.contentClass = contentClass;
		this.openModal = this.openModal.bind(this);
		this.trigger.addEventListener('click', this.openModal);
	}

	openModal() {
		this.overlay.classList.add(this.overlayClass);
		this.content.classList.add(this.contentClass);
	}

	closeModal() {
		this.overlay.classList.remove(this.overlayClass);
		this.content.classList.remove(this.contentClass);
	}
}

export { Modal };
