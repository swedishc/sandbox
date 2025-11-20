# Browser Blackjack

A lightweight, single-page blackjack game you can play directly in the browser. Hit, stand, and see if you can beat the dealer without busting.

## Playing

1. Open `index.html` in your browser.
2. Click **New Round** to deal cards.
3. Choose **Hit** to draw a card or **Stand** to let the dealer play.
4. The round ends when someone busts, hits blackjack, or both stand. Start another round any time.

No build steps or dependencies are required.

## Local testing
To try the game locally without any tooling, start a tiny static server and open it in your browser:

1. From this folder, run `python -m http.server 8000`.
2. Visit `http://localhost:8000` in your browser.
3. Click **New Round**, then play a few **Hit** and **Stand** actions to confirm scoring and round-ending messages appear.

## GitHub note
All game files live at the repository root (`index.html`, `script.js`, `styles.css`, and this README). If you do not see them on GitHub, push the branch to your remote.

If `git` reports `fatal: not a git repository`, first make sure you are inside this folder (it should contain the `.git` directory):

```bash
cd path/to/your/clone
git status
```

Once you are in the right folder (and `git status` works), push the current branch:

```bash
git remote add origin <your_repo_url>   # if not already set
git push origin work                    # or your current branch name
```
