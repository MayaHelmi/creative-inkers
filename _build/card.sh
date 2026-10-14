card() { # img title price sku
cat <<C
      <article class="card">
        <div class="card-art">
          <div class="flat alpha"><img src="assets/img/designs/$1.svg" alt="$2 design on a transparent background"></div>
          <div class="printed mockup"><img class="art" src="assets/img/designs/$1.svg" alt="The same design shown printed on a t-shirt"></div>
          <button class="peek" type="button" data-peek aria-pressed="false">See it printed</button>
        </div>
        <div class="card-body">
          <a class="card-title" href="product.html">$2</a>
          <span class="mono">300 DPI · PNG · Commercial</span>
          <div class="card-foot">
            <span class="price">\$$3</span>
            <button class="sq" type="button" data-add data-sku="$4" data-title="$2" data-price="$3" aria-label="Add $2 to cart">+</button>
          </div>
        </div>
      </article>
C
}
