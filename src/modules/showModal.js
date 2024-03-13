/* eslint-disable max-len */
import 'webcimes-modal/dist/css/webcimes-modal.css';
import { WebcimesModal } from 'webcimes-modal';

export default function showModal(type, obj, app) {
  // eslint-disable-next-line no-unused-vars
  const myModal = new WebcimesModal({
    setId: null, // set a specific id on the modal. default "null"
    setClass: null, // set a specific class on the modal, default "null"
    width: 'auto', // width (specify unit), default "auto"
    height: 'auto', // height (specify unit), default "auto"
    titleHtml: "<span style='color:red'>Delete?</span>", // html for title, default "null"
    bodyHtml: null, // html for body, default "null"
    buttonCancelHtml: 'Cancel', // html for cancel button, default "null"
    buttonConfirmHtml: 'Confirm', // html for confirm button, default "null"
    closeOnCancelButton: true, // close modal after trigger cancel button, default "true"
    closeOnConfirmButton: true, // close modal after trigger confirm button, default "true"
    showCloseButton: true, // show close button, default "true"
    allowCloseOutside: true, // allow the modal to close when clicked outside, default "true"
    allowMovement: true, // ability to move modal, default "true"
    moveFromHeader: true, // if allowMovement is set to "true", ability to move modal from header, default "true"
    moveFromBody: false, // if allowMovement is set to "true", ability to move modal from body, default "false"
    moveFromFooter: true, // if allowMovement is set to "true", ability to move modal from footer, default "true"
    stickyHeader: true, // keep header sticky (visible) when scrolling, default "true"
    stickyFooter: true, // keep footer sticky (visible) when scrolling, default "true"
    style: 'background:#fd8d8d;', // add extra css style to modal, default null
    animationOnShow: 'animDropDown', // "animDropDown" or "animFadeIn" for show animation, default "animDropDown"
    animationOnDestroy: 'animDropUp', // "animDropUp" or "animFadeOut" for destroy animation, default "animDropUp"
    animationDuration: 500, // animation duration in ms, default "500"
    beforeShow: () => {}, // callback before show modal
    afterShow: () => {}, // callback after show modal
    beforeDestroy: () => {}, // callback before destroy modal
    afterDestroy: () => {}, // callback after destroy modal
    onCancelButton: () => {}, // callback after triggering cancel button
    onConfirmButton: () => { app.deleteElement(type, obj); }, // callback after triggering confirm button
  });
}
