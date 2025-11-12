[Role]

You are an experienced author for top-tier ML/AI conferences (NeurIPS, ICML, ICLR, etc). Write the introduction section for a manuscript by following the given guide, storyline, and reference examples. 

[Guides]

1. A typical ML/AI conference paper's introduction contains {TBD} paragraphs.
2. The introduction contains the overall background, motivation, and high-level description of the proposed method.
3. All the claims should fit and be related to the core contribution. Do NOT claim anything outside of our contribution.
4. Focus and present more on our story and contribution-related content. Avoid presenting unrelated and "low information-dense" content. 
5. Avoid including too many technical details; for example, we commonly don't want equations to appear in the introduction. 
6. The language should be in academic style, clean, logical, easy to understand, and structured.
7. Do NOT use any emoji, italic, bold, etc, text decoration. Only use plain text.
8. Do NOT make up references. If there is a reference missing, use `\needref{}` as a placeholder. Any used reference should be verifed and listed at the end. 
9. The output should be in LaTeX code format. 

[Story Line]

This is the storyline of the proposed paper in the Q&A format. We are answering related questions in order by carefully thinking about the logical connection between each other. Answers to these questions should be carefully considered and important to be written as an introduction. 

What's the observation from previous works?
- Review previous papers, and find the phenomenon existing in previous works to support the reason for our work.
- This observation itself could be novel, could be a contribution. If no one has summarized similar observations before. 
- This is important to strengthen the meaning of our work as we are expecting to solve an existing problem instead of making up a problem by ourselves.

```
Answer
```

What's the problem behind the observation?
- Raise the existing problem behind the observation.
- The problem behind the observation must be novel, as we don't want to solve a problem that has already been solved. 
- This is important to attract the attention of reviewers, as if they find this is reasonable and even interesting, they will be curious about our solution method.

```
Answer
```

What method do we propose to solve the problem?
- Generally, describe the technique we proposed to solve the problem. More specifically, what do we do to solve the problem?
- The description could be done at an overall level and specific technique contributions at two levels.
- No need to write down all details (equations, model layers, etc), but use language to clearly describe the core part to do in the model/framework. 

```
Answer
```

Why does the proposed method work?
- Describe the hypothesis behind the proposed method to both intuitively and technically support the soundness of the method.
- The most important task is to make this explanation convincing. Make it easier to be understood, logical, and well considered. 
- This hypothesis should also be novel and interesting in expression to enhance the novelty and contribution.
- (Optional but good to have) The hypothesis could be general and can be applied to other areas as future work. Further enhance the contribution. 

```
Answer
```

What's the advantage of the proposed method?
- Explicitly explain how the proposed method solves the observed problem, results in better performance/more efficient/more generalizable, etc.
- If we have other extra advantages aside from targeting the observed problem, also describe them here.

```
Answer
```

How can the proposed method be validated?
- Clearly present the baseline(s) to compare with.
- Evaluate the feasibility of getting the experiment results, including the baselines' reproducibility, code availability, implementation feasibility, workload, and success rate.

```
Answer
```

Can we find a fancy way to tell this story?
- This part is not mandatory, but really good to have. A good high-level story could significantly enhance the contribution of the task.  
- This could be done by composing some "conception-level" description to explain the proposed technique, fitting with some low-level, fundamental techniques.
- The story should be closely connected with the hypothesis about why the proposed method works. Kind of step by step, further thinking.

```
Answer
``` 

[Writing]

First paragraph: task background
- Starting from a real-world application, present the nature and existence of the target problem, emphasizing the importance of solving the target problem at the application level.
- Present the challenge of the target problem in a general sense, emphasizing possible complexity, hard to solve, etc.
- This part could refer to the previous work a lot, as it's generally reused. 
- Example:
  ```
  NP-hard combinatorial optimization problems (COPs) pervade numerous real-world systems, each characterized by distinct constraints and objectives. The intrinsic complexity and heterogeneity of these problems compel domain experts to laboriously develop heuristics for their approximate solutions \cite{hromkovivc2013algorithmics_for_hard_problems}. Automation of heuristic designs represents a longstanding pursuit.
  ```

(Optional) Second paragraph: classical method
- This paragraph is also part of the background, focusing on a classical method for the target problem from possibly several years ago. For example, classical heuristic, algorithm, software, etc.
- Present the general limitations for these methods, including possible performance, efficiency, feasibility, flexibility, robustness, etc.
- The presented limitation should be related to the contribution. For example, if we don't have the contribution of efficiency, don't mention the limitation of efficiency.
- Same with the task background, this part could be shared by many related papers; we could refer to previous works about this. But remember to adjust the limitation points, following the previous suggestion.
- Example:
  ```
  Classic Hyper-Heuristics (HHs) automate heuristic design by searching for the best heuristic (combination) from a set of heuristics or heuristic components \cite{pillay2018hh_book}. Despite decades of development, HHs are limited by heuristic spaces predefined by human experts \cite{pillay2018hh_book}. The rise of large language models (LLMs) opens up new possibilities for HHs. This paper introduces the general concept of \textit{Language Hyper-Heuristics (LHH)} to advance beyond preliminary attempts in individual COP settings \cite{romera2023funsearch, liu2023algorithm_evolution}. LHH constitutes an emerging variant of HH that utilizes LLMs for heuristic generations. It features minimal human intervention and open-ended heuristic spaces, showing promise to comprehensively shift the HH research paradigm.
  ```

Third paragraph: baselines and motivations
- This paragraph presents the most related works to our paper. We organize these related papers and present the observation, the problem, and the limitations behind this observation.
- Starting from this paragraph, the content is related to our contribution, so the content should be closely related to our proposed idea and technique contributions.
- The previous works' limitations should be clearly presented, and our motivation should be strongly related to the limitations.
- Example:
  ```
  Pure LHH (e.g., LLM generations alone) is sample-inefficient and exhibits limited inference capability for black-box COPs. This work elicits the power of LHH with \textit{Reflective Evolution} (\our{}). \our{} couples evolutionary search for efficiently exploring heuristic spaces, with self-reflections to boost the reasoning capabilities of LLMs. It emulates human experts by reflecting on the relative performance of two heuristics and gathering insights across iterations. This reflection approach is analogous to interpreting genetic cues and providing "\textit{verbal gradient}" within search spaces. We introduce fitness landscape analysis and black-box prompting for reliable evaluation of LHHs. The dual-level reflections are shown to enhance heuristic search and induce verbal inference for black-box COPs, enabling \our{} to outperform prior state-of-the-art (SOTA) LHH \cite{liu2024_llm_gls}.
  ```
  
Fourth paragraph: our method
- This paragraph presents our contribution at the overall level and the technique level. We firstly generally present the overall contribution of our paper, targeting the proposed problem.
- We also summarize our technique contributions in this paragraph. This part is really important since it is related to the solidity of the paper.
- But do not present all the technical details of the contribution here. Just summarize them as what we did and what's the effectness & advantage & novel point of our proposed method. 
- Example:
  ```
  We introduce novel applications of LHHs and yield SOTA solvers with \our{}: (1) We evolve penalty heuristics for Guided Local Search (GLS), which outperforms SOTA learning-based \cite{ma2023neu_kopt, hudson2022_gnn_gls, sui2023neuralgls} and knowledge-based \cite{arnold2019_KGLS_VRP} (G)LS solvers. (2) We enhance Ant Colony Optimization (ACO) by evolving its heuristic measures, surpassing both neural-enhanced heuristics \cite{ye2023deepaco} and expert-designed heuristics \cite{skinderowicz2022_aco_tsp_human_bl, cai2022_aco_cvrp_human_bl, sohrabi2021_aco_op_human_bl, fidanova2020_aco_mkp_human_bl, levine2004_aco_bpp_human_bl}. (3) We refine the genetic algorithm (GA) for Electronic Design Automation (EDA) by evolving genetic operators, outperforming expert-designed GA \citep{park2023versatile} and the SOTA neural solver \citep{kim2023devformer} for the Decap Placement Problem (DPP). (4) Compared to a classic HH \cite{duflo2019gp_hh_tsp}, \our{} generates superior constructive heuristics for the Traveling Salesman Problem (TSP). (5) We enhance the generalization of SOTA neural combinatorial optimization (NCO) solvers \cite{kwon2020pomo,luo2023nco_heavy_decoder} by evolving heuristics for attention reshaping. For example, we improve the optimality gap of POMO \cite{kwon2020pomo} from 52\% to 29\% and LEHD \cite{luo2023nco_heavy_decoder} from 3.2\% to 3.0\% on TSP1000, with negligible additional time overhead and no need for tuning neural models.
  ```

Final paragraph: list of contributions
- Summarize and list the contribution of the paper into 3 list items.
- The first contribution item is an overall contribution, showing that we propose a model/framework/technique and solved the problem/limitation.
- The second contribution item is the technique contribution components of the proposed paper and their effects.
- The third contribution item is the experimental contribution. To show a throughout and competitive or even SOTA performance.
- This paragraph should be reasonably neat as a general summary.
- Example:
  ```
  We summarize our contributions as follows. (1) We propose the concept of Language Hyper-Heuristics (LHHs), which bridges emerging attempts using LLMs for heuristic generation with a methodological group that enjoys decades of development. (2) We present Reflective Evolution (\our{}), coupling evolutionary computation with humanoid reflections to elicit the power of LHHs. We introduce fitness landscape analysis and black-box prompting for reliable LHH evaluations, where \our{} achieves SOTA sample efficiency. (3) We introduce novel applications of LHHs and present SOTA COP solvers with \our{}, across five heterogeneous algorithmic types and six different COPs.
  ```
