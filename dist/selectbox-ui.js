/**
    MIT License

    Copyright (c) 2023 Carlos de Alfonso (https://github.com/dealfonso)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

(function(window, document, $) {
    "use strict";
    let defaultOptions = {
        initialBox: null,
        wrapperClass: "sb-selectboxui-wrapper",
        wrapperId: null,
        borderWidth: 5,
        addClasses: true,
        addBorders: true,
        addCorners: true,
        addSides: true,
        addFocus: true,
        modifySizes: true,
        resizeObserver: true
    };
    let target = null;
    let currentSelectbox = null;
    let mouseDownX = 0;
    let mouseDownY = 0;
    function onMouseUp(e) {
        if (target != null) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let deltaX = e.clientX - mouseDownX;
            let deltaY = e.clientY - mouseDownY;
            updateInterface(currentSelectbox, deltaX, deltaY, currentSelectbox);
            target.classList.remove("sb-resizing");
            target = null;
            let el = currentSelectbox.element;
            currentSelectbox = null;
            el.dispatchEvent(new CustomEvent("selectboxui:resize-end", {
                detail: el.selectBoxUI
            }));
        }
    }
    function onMouseMove(e) {
        if (target != null) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let deltaX = e.clientX - mouseDownX;
            let deltaY = e.clientY - mouseDownY;
            updateInterface(currentSelectbox, deltaX, deltaY);
            let el = currentSelectbox.element;
            el.dispatchEvent(new CustomEvent("selectboxui:resize", {
                detail: el.selectBoxUI
            }));
        }
    }
    function updateInterface(selectBoxUI, deltaX = 0, deltaY = 0, updateBox = null) {
        if (updateBox === null) {
            updateBox = Object.assign({}, selectBoxUI);
        }
        if (selectBoxUI.borders.left !== null) {
            if (target === selectBoxUI.borders.left) {
                deltaX = Math.max(Math.min(deltaX, selectBoxUI.right - 1 - selectBoxUI.left), -selectBoxUI.left);
                updateBox.left += deltaX;
            } else if (target === selectBoxUI.borders.right) {
                deltaX = Math.min(Math.max(deltaX, 1 - selectBoxUI.right + selectBoxUI.left), selectBoxUI.width - selectBoxUI.right);
                updateBox.right += deltaX;
            } else if (target === selectBoxUI.borders.top) {
                deltaY = Math.max(Math.min(deltaY, selectBoxUI.bottom - 1 - selectBoxUI.top), -selectBoxUI.top);
                updateBox.top += deltaY;
            } else if (target === selectBoxUI.borders.bottom) {
                deltaY = Math.min(Math.max(deltaY, 1 - selectBoxUI.bottom + selectBoxUI.top), selectBoxUI.height - selectBoxUI.bottom);
                updateBox.bottom += deltaY;
            }
        }
        if (selectBoxUI.corners.topleft !== null) {
            if (target === selectBoxUI.corners.topleft) {
                deltaX = Math.max(Math.min(deltaX, selectBoxUI.right - 1 - selectBoxUI.left), -selectBoxUI.left);
                deltaY = Math.max(Math.min(deltaY, selectBoxUI.bottom - 1 - selectBoxUI.top), -selectBoxUI.top);
                updateBox.left += deltaX;
                updateBox.top += deltaY;
            } else if (target === selectBoxUI.corners.bottomleft) {
                deltaX = Math.max(Math.min(deltaX, selectBoxUI.right - 1 - selectBoxUI.left), -selectBoxUI.left);
                deltaY = Math.min(Math.max(deltaY, 1 - selectBoxUI.bottom + selectBoxUI.top), selectBoxUI.height - selectBoxUI.bottom);
                updateBox.left += deltaX;
                updateBox.bottom += deltaY;
            } else if (target === selectBoxUI.corners.topright) {
                deltaX = Math.min(Math.max(deltaX, 1 - selectBoxUI.right + selectBoxUI.left), selectBoxUI.width - selectBoxUI.right);
                deltaY = Math.max(Math.min(deltaY, selectBoxUI.bottom - 1 - selectBoxUI.top), -selectBoxUI.top);
                updateBox.right += deltaX;
                updateBox.top += deltaY;
            } else if (target === selectBoxUI.corners.bottomright) {
                deltaX = Math.min(Math.max(deltaX, 1 - selectBoxUI.right + selectBoxUI.left), selectBoxUI.width - selectBoxUI.right);
                deltaY = Math.min(Math.max(deltaY, 1 - selectBoxUI.bottom + selectBoxUI.top), selectBoxUI.height - selectBoxUI.bottom);
                updateBox.right += deltaX;
                updateBox.bottom += deltaY;
            }
        }
        if (selectBoxUI.focus !== null && target === selectBoxUI.focus) {
            if (deltaX < 0) {
                deltaX = Math.max(deltaX, -selectBoxUI.left);
            } else {
                deltaX = Math.min(deltaX, selectBoxUI.width - selectBoxUI.right);
            }
            if (deltaY < 0) {
                deltaY = Math.max(deltaY, -selectBoxUI.top);
            } else {
                deltaY = Math.min(deltaY, selectBoxUI.height - selectBoxUI.bottom);
            }
            updateBox.left += deltaX;
            updateBox.right += deltaX;
            updateBox.top += deltaY;
            updateBox.bottom += deltaY;
            updateBox.left = Math.min(Math.max(updateBox.left, 0), selectBoxUI.width);
            updateBox.right = Math.min(Math.max(updateBox.right, 0), selectBoxUI.width);
            updateBox.top = Math.min(Math.max(updateBox.top, 0), selectBoxUI.height);
            updateBox.bottom = Math.min(Math.max(updateBox.bottom, 0), selectBoxUI.height);
        }
        if (updateBox.sides.left !== null) {
            updateBox.sides.left.style.top = "0px";
            updateBox.sides.left.style.left = "0px";
            updateBox.sides.left.style.width = `${updateBox.left}px`;
            updateBox.sides.left.style.height = `${updateBox.height}px`;
            updateBox.sides.right.style.top = "0px";
            updateBox.sides.right.style.left = `${updateBox.right}px`;
            updateBox.sides.right.style.width = `${updateBox.width - updateBox.right}px`;
            updateBox.sides.right.style.height = `${updateBox.height}px`;
            updateBox.sides.top.style.top = `0px`;
            updateBox.sides.top.style.left = `${updateBox.left}px`;
            updateBox.sides.top.style.width = `${updateBox.right - updateBox.left}px`;
            updateBox.sides.top.style.height = `${updateBox.top}px`;
            updateBox.sides.bottom.style.top = `${updateBox.bottom}px`;
            updateBox.sides.bottom.style.left = `${updateBox.left}px`;
            updateBox.sides.bottom.style.width = `${updateBox.right - updateBox.left}px`;
            updateBox.sides.bottom.style.height = `${updateBox.height - updateBox.bottom}px`;
        }
        if (updateBox.borders.left !== null) {
            updateBox.borders.left.style.left = `${updateBox.left}px`;
            updateBox.borders.left.style.right = `${updateBox.left + updateBox.borders.width}px`;
            updateBox.borders.left.style.width = `${updateBox.borders.width}px`;
            updateBox.borders.left.style.height = `100%`;
            updateBox.borders.right.style.left = `${updateBox.right - updateBox.borders.width}px`;
            updateBox.borders.right.style.right = `${updateBox.right}px`;
            updateBox.borders.right.style.width = `${updateBox.borders.width}px`;
            updateBox.borders.right.style.height = `100%`;
            updateBox.borders.top.style.top = `${updateBox.top}px`;
            updateBox.borders.top.style.bottom = `${updateBox.top + updateBox.borders.width}px`;
            updateBox.borders.top.style.height = `${updateBox.borders.width}px`;
            updateBox.borders.top.style.width = `100%`;
            updateBox.borders.bottom.style.top = `${updateBox.bottom - updateBox.borders.width}px`;
            updateBox.borders.bottom.style.bottom = `${updateBox.bottom}px`;
            updateBox.borders.bottom.style.height = `${updateBox.borders.width}px`;
            updateBox.borders.bottom.style.width = `100%`;
        }
        if (updateBox.corners.topleft !== null) {
            updateBox.corners.topleft.style.top = `${updateBox.top}px`;
            updateBox.corners.topleft.style.left = `${updateBox.left}px`;
            updateBox.corners.topleft.style.width = `${updateBox.borders.width}px`;
            updateBox.corners.topleft.style.height = `${updateBox.borders.width}px`;
            updateBox.corners.bottomleft.style.top = `${updateBox.bottom - updateBox.borders.width}px`;
            updateBox.corners.bottomleft.style.left = `${updateBox.left}px`;
            updateBox.corners.bottomleft.style.width = `${updateBox.borders.width}px`;
            updateBox.corners.bottomleft.style.height = `${updateBox.borders.width}px`;
            updateBox.corners.topright.style.top = `${updateBox.top}px`;
            updateBox.corners.topright.style.left = `${updateBox.right - updateBox.borders.width}px`;
            updateBox.corners.topright.style.width = `${updateBox.borders.width}px`;
            updateBox.corners.topright.style.height = `${updateBox.borders.width}px`;
            updateBox.corners.bottomright.style.top = `${updateBox.bottom - updateBox.borders.width}px`;
            updateBox.corners.bottomright.style.left = `${updateBox.right - updateBox.borders.width}px`;
            updateBox.corners.bottomright.style.width = `${updateBox.borders.width}px`;
            updateBox.corners.bottomright.style.height = `${updateBox.borders.width}px`;
        }
        if (updateBox.focus !== null) {
            updateBox.focus.style.top = `${updateBox.top}px`;
            updateBox.focus.style.left = `${updateBox.left}px`;
            updateBox.focus.style.width = `${updateBox.right - updateBox.left}px`;
            updateBox.focus.style.height = `${updateBox.bottom - updateBox.top}px`;
        }
        let el = updateBox.element;
        if (el !== undefined) {
            el.dispatchEvent(new CustomEvent("selectboxui:changed", {
                detail: el.selectBoxUI
            }));
        }
    }
    function correctSelectBoxUISizes(selectBoxUI, left = null, top = null, right = null, bottom = null) {
        if (left === null) {
            left = selectBoxUI.left;
        }
        if (right === null) {
            right = selectBoxUI.right;
        }
        if (top === null) {
            top = selectBoxUI.top;
        }
        if (bottom === null) {
            bottom = selectBoxUI.bottom;
        }
        if (isNaN(left)) {
            left = 0;
        }
        if (isNaN(right)) {
            right = selectBoxUI.width;
        }
        if (isNaN(top)) {
            top = 0;
        }
        if (isNaN(bottom)) {
            bottom = selectBoxUI.height;
        }
        if (left < 0) {
            left = selectBoxUI.width + left;
        }
        if (right < 0) {
            right = selectBoxUI.width + right;
        }
        if (top < 0) {
            top = selectBoxUI.height + top;
        }
        if (bottom < 0) {
            bottom = selectBoxUI.height + bottom;
        }
        left = Math.max(0, Math.min(left, selectBoxUI.width));
        right = Math.max(0, Math.min(right, selectBoxUI.width));
        top = Math.max(0, Math.min(top, selectBoxUI.height));
        bottom = Math.max(0, Math.min(bottom, selectBoxUI.height));
        selectBoxUI.left = Math.min(left, right);
        selectBoxUI.right = Math.max(right, left);
        selectBoxUI.top = Math.min(top, bottom);
        selectBoxUI.bottom = Math.max(bottom, top);
    }
    function setBoxFromString(selectBoxUI, boxString) {
        let box = boxString.split(" ");
        function valueOrPct(value, maxValue = 1) {
            if (value.endsWith("%")) {
                return parseFloat(value) / 100 * maxValue;
            } else {
                return parseFloat(value);
            }
        }
        if (box.length === 4) {
            selectBoxUI.left = valueOrPct(box[0], selectBoxUI.width);
            selectBoxUI.top = valueOrPct(box[1], selectBoxUI.height);
            selectBoxUI.right = valueOrPct(box[2], selectBoxUI.width);
            selectBoxUI.bottom = valueOrPct(box[3], selectBoxUI.height);
        } else if (box.length === 2) {
            let horizontal = valueOrPct(box[0], selectBoxUI.width);
            let vertical = valueOrPct(box[1], selectBoxUI.height);
            selectBoxUI.left = horizontal;
            selectBoxUI.right = selectBoxUI.width - horizontal;
            selectBoxUI.top = vertical;
            selectBoxUI.bottom = selectBoxUI.height - vertical;
        } else if (box.length === 1) {
            let horizontal = valueOrPct(box[0], selectBoxUI.width);
            let vertical = valueOrPct(box[0], selectBoxUI.height);
            selectBoxUI.left = horizontal;
            selectBoxUI.right = selectBoxUI.width - horizontal;
            selectBoxUI.top = vertical;
            selectBoxUI.bottom = selectBoxUI.height - vertical;
        } else {
            console.error("Invalid box string");
            return false;
        }
        return true;
    }
    function resizeSelectBox(entry) {
        let el = entry.target;
        if (el.selectBoxUI === undefined) {
            return;
        }
        let width = entry.contentRect.width;
        let height = entry.contentRect.height;
        let wratio = width / el.selectBoxUI.width;
        let hratio = height / el.selectBoxUI.height;
        el.selectBoxUI.left *= wratio;
        el.selectBoxUI.right *= wratio;
        el.selectBoxUI.top *= hratio;
        el.selectBoxUI.bottom *= hratio;
        el.selectBoxUI.width = width;
        el.selectBoxUI.height = height;
        correctSelectBoxUISizes(el.selectBoxUI);
        el.selectBoxUI.wrapper.style.width = `${width}px`;
        el.selectBoxUI.wrapper.style.height = `${height}px`;
        el.selectBoxUI.updateInterface();
        el.dispatchEvent(new CustomEvent("selectboxui:element-resized", {
            detail: el.selectBoxUI
        }));
    }
    function selectBoxUI(el, userOptions = {}) {
        let elOptions = {};
        if (el.dataset.selectboxuiWrapperClass !== undefined) {
            let classes = el.dataset.selectboxuiWrapperClass.split(" ");
            classes.push(defaultOptions.wrapperClass);
            elOptions.wrapperClass = classes.join(" ");
        }
        if (el.dataset.selectboxuiWrapperId !== undefined) {
            elOptions.id = el.dataset.selectboxuiWrapperId;
        }
        if (el.dataset.selectboxuiBorderWidth !== undefined) {
            let borderWidth = parseInt(el.dataset.selectboxuiBorderWidth);
            if (!isNaN(borderWidth)) {
                elOptions.borderWidth = borderWidth;
            }
        }
        if (el.dataset.selectboxuiNoAddClasses !== undefined) {
            if (el.dataset.selectboxuiNoAddClasses.toLowerCase() !== "false") {
                elOptions.addClasses = false;
            }
        }
        if (el.dataset.selectboxuiNoBorders !== undefined) {
            if (el.dataset.selectboxuiNoBorders.toLowerCase() !== "false") {
                elOptions.addBorders = false;
            }
        }
        if (el.dataset.selectboxuiNoCorners !== undefined) {
            if (el.dataset.selectboxuiNoCorners.toLowerCase() !== "false") {
                elOptions.addCorners = false;
            }
        }
        if (el.dataset.selectboxuiNoSides !== undefined) {
            if (el.dataset.selectboxuiNoSides.toLowerCase() !== "false") {
                elOptions.addSides = false;
            }
        }
        if (el.dataset.selectboxuiNoFocus !== undefined) {
            if (el.dataset.selectboxuiNoFocus.toLowerCase() !== "false") {
                elOptions.addFocus = false;
            }
        }
        if (el.dataset.selectboxuiInitialBox !== undefined) {
            elOptions.initialBox = el.dataset.selectboxuiInitialBox;
        }
        if (el.dataset.selectboxuiNoModifySizes !== undefined) {
            elOptions.modifySizes = el.dataset.selectboxuiNoModifySizes.toLowerCase() !== "false";
        }
        if (el.dataset.selectboxuiNoResizeObserver !== undefined) {
            elOptions.resizeObserver = el.dataset.selectboxuiNoResizeObserver.toLowerCase() !== "false";
        }
        let options = Object.assign({}, defaultOptions, window.selectBoxUI.defaults, elOptions, userOptions);
        if (el.tagName.toLowerCase() !== "img") {
            prepareSelectbox(el, options);
        } else {
            if (el.complete) {
                prepareSelectbox(el, options);
            } else {
                el.addEventListener("load", function() {
                    prepareSelectbox(el, options);
                });
                el.addEventListener("error", function() {
                    alert("error");
                });
            }
        }
        function prepareSelectbox(el, options = {}) {
            function onMouseDown(e) {
                if (e.which === 1) {
                    target = e.target;
                    target.classList.add("sb-resizing");
                    currentSelectbox = el.selectBoxUI;
                    mouseDownX = e.clientX;
                    mouseDownY = e.clientY;
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    el.dispatchEvent(new CustomEvent("selectboxui:resize-start", {
                        detail: el.selectBoxUI
                    }));
                }
            }
            function createElement(tagName, classNames, parent = null, onmousedown = onMouseDown) {
                let el = document.createElement(tagName);
                if (classNames.trim() != "") {
                    el.classList.add(...classNames.split(" "));
                }
                if (parent !== null) {
                    parent.appendChild(el);
                }
                if (onmousedown !== null) {
                    el.addEventListener("mousedown", onmousedown);
                }
                return el;
            }
            let wrapper = createElement("div", options.wrapperClass, null, null);
            if (options.id !== null && options.id !== undefined && options.id != "") {
                wrapper.id = options.id;
            }
            if (options.addClasses) {
                el.classList.forEach(className => {
                    wrapper.classList.add(className);
                });
            }
            el.classList = [];
            let width = el.offsetWidth;
            let height = el.offsetHeight;
            wrapper.style.width = `${width}px`;
            wrapper.style.height = `${height}px`;
            wrapper.style.padding = el.style.padding ?? "unset";
            wrapper.style.margin = el.style.margin ?? "unset";
            wrapper.style.border = el.style.border ?? "unset";
            el.style.padding = "0px";
            el.style.margin = "0px";
            el.style.border = "0px";
            wrapper.style.position = "relative";
            el.style.position = "absolute";
            if (options.modifySizes) {
                el.style.top = "0px";
                el.style.left = "0px";
                el.style.width = "100%";
                el.style.height = "100%";
            }
            wrapper.style.zIndex = el.style.zIndex;
            el.style.zIndex = "0";
            let focusSection = null;
            if (options.addFocus) {
                focusSection = createElement("div", "sb-element sb-focus", wrapper);
                focusSection.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(0, 0, el.selectBoxUI.height, el.selectBoxUI.width);
                    e.preventDefault();
                });
            }
            let cornerTopLeft = null, cornerBottomLeft = null, cornerTopRight = null, cornerBottomRight = null;
            if (options.addCorners) {
                cornerTopLeft = createElement("div", "sb-element sb-corner sb-corner-topleft", wrapper);
                cornerBottomLeft = createElement("div", "sb-element sb-corner sb-corner-bottomleft", wrapper);
                cornerTopRight = createElement("div", "sb-element sb-corner sb-corner-topright", wrapper);
                cornerBottomRight = createElement("div", "sb-element sb-corner sb-corner-bottomright", wrapper);
                cornerTopLeft.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(0, 0, null, null);
                    e.preventDefault();
                });
                cornerBottomLeft.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(null, 0, el.selectBoxUI.height, null);
                    e.preventDefault();
                });
                cornerTopRight.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(0, null, null, el.selectBoxUI.width);
                    e.preventDefault();
                });
                cornerBottomRight.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(null, null, el.selectBoxUI.height, el.selectBoxUI.width);
                    e.preventDefault();
                });
            }
            let borderLeft = null, borderRight = null, borderTop = null, borderBottom = null;
            if (options.addBorders) {
                borderLeft = createElement("div", "sb-element sb-border sb-border-left", wrapper);
                borderRight = createElement("div", "sb-element sb-border sb-border-right", wrapper);
                borderTop = createElement("div", "sb-element sb-border sb-border-top", wrapper);
                borderBottom = createElement("div", "sb-element sb-border sb-border-bottom", wrapper);
                borderLeft.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(null, 0, null, null);
                    e.preventDefault();
                });
                borderRight.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(null, null, null, el.selectBoxUI.width);
                    e.preventDefault();
                });
                borderTop.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(0, null, null, null);
                    e.preventDefault();
                });
                borderBottom.addEventListener("dblclick", function(e) {
                    el.selectBoxUI.updateInterface(null, null, el.selectBoxUI.height, null);
                    e.preventDefault();
                });
            }
            let leftSide = null, rightSide = null, topSide = null, bottomSide = null;
            if (options.addSides) {
                leftSide = createElement("div", "sb-element sb-side-box sb-side-box-left", wrapper, null);
                rightSide = createElement("div", "sb-element sb-side-box sb-side-box-right", wrapper, null);
                topSide = createElement("div", "sb-element sb-side-box sb-side-box-top", wrapper, null);
                bottomSide = createElement("div", "sb-element sb-side-box sb-side-box-bottom", wrapper, null);
            }
            el.selectBoxUI = {
                left: 0,
                top: 0,
                right: width,
                bottom: height,
                width: width,
                height: height,
                borders: {
                    width: options.borderWidth,
                    left: borderLeft,
                    right: borderRight,
                    top: borderTop,
                    bottom: borderBottom
                },
                corners: {
                    topleft: cornerTopLeft,
                    bottomleft: cornerBottomLeft,
                    topright: cornerTopRight,
                    bottomright: cornerBottomRight
                },
                sides: {
                    left: leftSide,
                    right: rightSide,
                    top: topSide,
                    bottom: bottomSide
                },
                focus: focusSection,
                wrapper: wrapper,
                element: el,
                observer: new ResizeObserver(entries => {
                    entries.forEach(entry => resizeSelectBox(entry));
                }),
                updateInterface: function(top = null, left = null, bottom = null, right = null) {
                    left = left ?? el.selectBoxUI.left;
                    right = right ?? el.selectBoxUI.right;
                    top = top ?? el.selectBoxUI.top;
                    bottom = bottom ?? el.selectBoxUI.bottom;
                    if (left < 0) {
                        left = el.selectBoxUI.width + left;
                    }
                    if (right < 0) {
                        right = el.selectBoxUI.width + right;
                    }
                    if (top < 0) {
                        top = el.selectBoxUI.height + top;
                    }
                    if (bottom < 0) {
                        bottom = el.selectBoxUI.height + bottom;
                    }
                    el.selectBoxUI.left = Math.min(left, right);
                    el.selectBoxUI.right = Math.max(right, left);
                    el.selectBoxUI.top = Math.min(top, bottom);
                    el.selectBoxUI.bottom = Math.max(bottom, top);
                    updateInterface(el.selectBoxUI);
                },
                disable: function() {
                    let els = el.selectBoxUI.wrapper.querySelectorAll(".sb-element");
                    els.forEach(el => {
                        el.classList.add("sb-ignore-mouse");
                    });
                    el.dispatchEvent(new CustomEvent("selectboxui:disable", {
                        detail: el.selectBoxUI
                    }));
                },
                enable: function() {
                    let els = el.selectBoxUI.wrapper.querySelectorAll(".sb-element");
                    els.forEach(el => {
                        el.classList.remove("sb-ignore-mouse");
                    });
                    el.dispatchEvent(new CustomEvent("selectboxui:enable", {
                        detail: el.selectBoxUI
                    }));
                },
                show: function() {
                    let els = el.selectBoxUI.wrapper.querySelectorAll(".sb-element");
                    els.forEach(el => {
                        el.classList.remove("sb-hidden");
                    });
                    el.dispatchEvent(new CustomEvent("selectboxui:show", {
                        detail: el.selectBoxUI
                    }));
                },
                hide: function() {
                    let els = el.selectBoxUI.wrapper.querySelectorAll(".sb-element");
                    els.forEach(el => {
                        el.classList.add("sb-hidden");
                    });
                    el.dispatchEvent(new CustomEvent("selectboxui:hide", {
                        detail: el.selectBoxUI
                    }));
                },
                get: function() {
                    return {
                        left: el.selectBoxUI.left,
                        top: el.selectBoxUI.top,
                        right: el.selectBoxUI.right,
                        bottom: el.selectBoxUI.bottom,
                        width: el.selectBoxUI.width,
                        height: el.selectBoxUI.height
                    };
                },
                set: function(boxString) {
                    setBoxFromString(el.selectBoxUI, boxString);
                    correctSelectBoxUISizes(el.selectBoxUI);
                    updateInterface(el.selectBoxUI);
                },
                bounce: function() {
                    el.selectBoxUI.wrapper.classList.add("sb-bounce");
                    el.dispatchEvent(new CustomEvent("selectboxui:bounce-start", {
                        detail: el.selectBoxUI
                    }));
                    setTimeout(() => {
                        el.selectBoxUI.wrapper.classList.remove("sb-bounce");
                        el.dispatchEvent(new CustomEvent("selectboxui:bounce-end", {
                            detail: el.selectBoxUI
                        }));
                    }, 2100);
                }
            };
            if (options.initialBox !== null) {
                if (!setBoxFromString(el.selectBoxUI, options.initialBox)) {
                    console.error("Invalid initial box");
                } else {
                    correctSelectBoxUISizes(el.selectBoxUI);
                }
            }
            updateInterface(el.selectBoxUI);
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            if (options.resizeObserver) {
                el.selectBoxUI.observer.observe(el);
            }
        }
    }
    window.selectBoxUI = selectBoxUI;
    window.selectBoxUI.defaults = Object.assign({}, defaultOptions);
    window.selectBoxUI.version = "1.1.0";
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
            let els = document.querySelectorAll("[data-selectboxui]");
            els.forEach(el => {
                selectBoxUI(el);
            });
        });
    }
    if ($ !== undefined) {
        $.fn.selectBoxUI = function(options, ...parameters) {
            if (this.length === 0) {
                return this;
            }
            if (options === "get" && this[0].selectBoxUI !== undefined) {
                return this[0].selectBoxUI.get();
            }
            this.each(function() {
                if (typeof options === "string") {
                    if (this.selectBoxUI === undefined) {
                        console.error("The element doesn't have a selectbox");
                        return;
                    }
                    switch (options) {
                      case "disable":
                        this.selectBoxUI.disable();
                        break;

                      case "enable":
                        this.selectBoxUI.enable();
                        break;

                      case "show":
                        this.selectBoxUI.show();
                        break;

                      case "hide":
                        this.selectBoxUI.hide();
                        break;

                      case "set":
                        if (parameters.length === 0) {
                            console.error("Missing box string");
                            return;
                        }
                        this.selectBoxUI.set(parameters[0]);
                        break;

                      case "bounce":
                        this.selectBoxUI.bounce();
                        break;

                      default:
                        console.error(`Unknown option ${options}`);
                    }
                } else {
                    selectBoxUI(this, options);
                }
            });
            return this;
        };
    }
})(window, document, window.$);
