We are building a code to image app. It will convert our code snippets into beautiful images.

The main layout of the app will be as follows:

- On the left side we will have a sidebar that will control the styling of our image
- On the right side we will have a code editor, positioned at the center of this part

1. The sidebar

- We can control the theme, the font size, and the background color of the image, I think can divide our image as follows:
  - The frame, which is going to be the background of the code snippet image, we should be able to control the opacity, color, border radius, of this frame. Adding padding. We should be able to control the width and height of the frame, and also the aspect ratio of the image. We should have some premade aspect ratios, like 16:9, 4:3, etc. We should have premade paddings for the frame.
  - The editor window, or whatever you want to call it, this one should centered in the frame, for the editor itself I think we can just use codemirror, because it has a good language support, and there are a lot of themes avalaible. But we should add a container to contain the editor, to make it easier to control the border radius of the editor window, add padding, etc. We should aslo be able to control the font size of the code snippet, we need to be able to format the code. We need to be able to show the line numbers or not. We should be able to control the font weight of the code snippet.We should be able to add box shadow to the code snippet window, we should have some premade box shadows, like small, medium, large, etc.

2. The editor (right side)

- Basically render all the states into the editor, etc2, we should be able to resize the editor iframe, but we need to make the minumum size of the iframe based on the editor itself, the editor window, should dictate the minimum size of the iframe. We can only resize horizontally, because the vertical space is calcualted based on the code snipept window itself, plus the the padding of the frame, etc2.

You can check that we have a lot of premade components inside the src/lib/components/ui, so no need to write all the primitive components like input select, checkbox, slider, etc. from scratch, Just read the componetn code and you will now how to use it. For styling use tailwind css as much as you can, but of couse someimtes we need to do style object because of the nature of our apps, some properties are meant to be easily customizable, so using tailwind is not a good idea for that purpose, for example adding padding for our frame, etc2.

We will only have one route which is the "/" page

We need to have a header, on the right side of the header, we need to display the export button, and on the left side of the header we need to dispplay our logo.

Please write the best export method, allow user to choose the scale of the image, basically we will use some type of html2img package, and we need to resize sometimes to make it looks good, so we need to have a way to resize the image. The format of the exported image is png, and thats it.
