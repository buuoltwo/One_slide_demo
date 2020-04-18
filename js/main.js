const isMain = s => (/^#{1,2}(?!#)/).test(s)
const isSub =  s => (/^#{3}(?!#)/).test(s)
const convert = raw => {
  let arr = raw.split(/\n(?=\s*#)/).filter(s => s !== "").map(a => a.trim())
  let html = ""
  for(let i = 0; i < arr.length; i++) {
    if(arr[i+1] !== undefined) {
      if(isMain(arr[i]) && isMain(arr[i+1])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
        `
      }
      else if(isMain(arr[i]) && isSub(arr[i+1])) {
        html +=`
        <section>
          <section data-markdown>
            <textarea data-template>
            ${arr[i]}
            </textarea>
          </section>
        `
      }
      else if(isSub(arr[i]) && isSub(arr[i+1])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
        `
      }
      else if(isSub(arr[i]) && isMain(arr[i+1])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
      </section>
        `
      }
    }
    else{
      if(isSub(arr[i])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
      </section>
        `
      }
      else if(isMain(arr[i])) {
        html +=`
        <section data-markdown>
          <textarea data-template>
          ${arr[i]}
          </textarea>
        </section>
        `
      }

    }
  }
  return html
}








let $ = s => document.querySelector(s)
let $$ = s => document.querySelectorAll(s)

const Editor = {
  init() {
    this.$saveBtn = $(".main button.save")
    this.$editorInput = $(".main textarea")
    this.markdown = localStorage.markdown || `# One Slide`
    this.$slidesContainer = $(".slides")
    this.bind()
    this.start()
  },

  bind() {
    this.$saveBtn.onclick = () => {
      // loadMarkdown(this.$editorInput.value)
      localStorage.markdown = this.$editorInput.value
      location.reload()
    }
  },

  start() {
    console.log("Editor starts>>>")
    console.log(this.markdown)
    let html = convert(this.markdown)
    this.$slidesContainer.innerHTML = html
    this.$editorInput.value = this.markdown
    Reveal.initialize({
      controls: true,
      progress: true,
      center: true,
      hash: true,

      transition: 'convex', // none/fade/slide/convex/concave/zoom

      // More info https://github.com/hakimel/reveal.js#dependencies
      dependencies: [
        { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'plugin/highlight/highlight.js' },
        { src: 'plugin/search/search.js', async: true },
        { src: 'plugin/zoom-js/zoom.js', async: true },
        { src: 'plugin/notes/notes.js', async: true }
      ]
    });	
  }
}
const Menu = {
  init() {
    console.log("Menu init..")

    this.$settingIcon = $(".control .icon-setting")
    this.$menu = $(".menu")
    this.$close = $(".menu .icon-close")
    this.$$tabs = $$(".aside .tab")
    this.$$panels = $$(".main .content")

    this.bind()
  },
  bind() {
    //A
    this.$settingIcon.onclick = () => {
      this.$menu.classList.add("open")
    }
    this.$close.onclick = () => {
      this.$menu.classList.remove("open")
    }
    
    //B
    this.$$tabs.forEach($tab => $tab.onclick = () => {
      this.$$tabs.forEach($node => $node.classList.remove("active"))
      $tab.classList.add("active")
      let index = [...this.$$tabs].indexOf($tab)
      this.$$panels.forEach($panel => $panel.classList.remove("active"))
      this.$$panels[index].classList.add("active")

    })
  }
}

const App = {
  init() {
    [...arguments].forEach(Module => Module.init())
  }
}
App.init(Menu, Editor)