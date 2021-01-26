import React from 'react'
import PropTypes from 'prop-types'

function BulmaModal({show, close, title, children, footer}) {
    return (
        <div className={`modal ${show ? "is-active": ""}`}>
            <div className="modal-background" onClick={close}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    {title && <p className="modal-card-title">{title}</p>}
                    <button className="delete" aria-label="close" onClick={close}></button>
                </header>
                {children && <section className="modal-card-body">
                    <>{children}</>
                </section>}
                {footer && <footer className="modal-card-foot">
                    <>{footer}</>
                </footer>}
            </div>
        </div>
    )
}

BulmaModal.propTypes = {
    close: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    title: PropTypes.string,
    children: PropTypes.element,
    footer: PropTypes.element
}

export default BulmaModal

