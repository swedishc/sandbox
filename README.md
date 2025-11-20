# Browser Blackjack Trainer

Practice optimal blackjack decisions in your browser. Make hit/stand choices, match basic strategy to earn points, and read coaching notes that explain why each move works.

## Playing

1. Open `index.html` in your browser.
2. Click **New Round** to deal cards.
3. Choose **Hit** to draw a card or **Stand** to let the dealer play.
4. Match the recommended action to gain training points; the strategy coach explains why each choice is correct for your hand.
5. The round ends when someone busts, hits blackjack, or both stand. Start another round any time.

No build steps or dependencies are required.

### Training specifics
- The coach follows common blackjack basic strategy for hit/stand decisions (no splitting or doubling in this simplified trainer).
- Each correct choice awards 10 points; incorrect choices give feedback but no points.
- Soft totals (hands with an ace counted as 11) encourage hitting until at least 18, with extra aggression against high dealer upcards.
- Hard totals follow standard rules: hit 11 and under, stand on 17+, stand 13–16 against dealer 2–6, and hit those totals against 7+.

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

If you download the repo and only see an empty `README.md`, double-check you pulled the right branch and that the download finished completely:

1. If using Git, run `git branch --show-current` and make sure you are on `work` (or the branch where the game was committed).
2. Run `git fetch --all --prune` followed by `git checkout work` to switch to the branch with the files.
3. Run `ls` in the repo root; you should see `index.html`, `script.js`, and `styles.css` alongside the README.
4. If you downloaded a ZIP, try downloading again and confirm the ZIP extracts these files in the top-level folder.
