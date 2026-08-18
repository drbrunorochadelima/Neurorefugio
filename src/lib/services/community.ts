import { createLocalCollection, generateId } from "@/lib/storage/local-collection";
import { registerUserDataSource } from "@/lib/storage/user-data-registry";
import type { Block, ForumComment, ForumPost, ReactionType, Report } from "@/lib/schemas/community";

/**
 * O fórum é piloto fechado (§14): só usuários autenticados publicam, e
 * publicações passam por rascunho → revisão → publicado antes de ficarem
 * visíveis a outras pessoas.
 */
export const COMMUNITY_PILOT_CLOSED = true;

const postsCollection = createLocalCollection<ForumPost>("neurorefugio.forumPosts.v1");
const commentsCollection = createLocalCollection<ForumComment>("neurorefugio.forumComments.v1");
const reportsCollection = createLocalCollection<Report>("neurorefugio.forumReports.v1");
const blocksCollection = createLocalCollection<Block>("neurorefugio.forumBlocks.v1");

registerUserDataSource({
  key: "neurorefugio.forumPosts.v1",
  label: "Publicações na comunidade",
  exportForUser: (userId) => postsCollection.list().filter((p) => p.authorId === userId),
  deleteForUser: (userId) =>
    postsCollection.replaceAll(postsCollection.list().filter((p) => p.authorId !== userId)),
});
registerUserDataSource({
  key: "neurorefugio.forumComments.v1",
  label: "Comentários na comunidade",
  exportForUser: (userId) => commentsCollection.list().filter((c) => c.authorId === userId),
  deleteForUser: (userId) =>
    commentsCollection.replaceAll(commentsCollection.list().filter((c) => c.authorId !== userId)),
});

const DEMO_AUTHOR = "Comunidade NeuroRefúgio (perfil demonstrativo)";

function seedDemoPosts(): void {
  const now = new Date().toISOString();
  postsCollection.seedIfEmpty([
    {
      id: "seed-post-1",
      authorId: "demo-seed",
      authorDisplayName: DEMO_AUTHOR,
      categoria: "trabalho-em-saude",
      titulo: "Como vocês pedem pausas sensoriais no plantão?",
      corpo:
        "Este é um exemplo demonstrativo de publicação. Tenho percebido que preciso de pausas mais curtas e frequentes durante plantões longos, mas nem sempre sei como pedir isso sem parecer que estou 'fugindo' do trabalho. Como vocês lidam com isso?",
      status: "publicado",
      createdAt: now,
      updatedAt: now,
      reactions: {},
    },
    {
      id: "seed-post-2",
      authorId: "demo-seed",
      authorDisplayName: DEMO_AUTHOR,
      categoria: "diagnostico-tardio",
      titulo: "Diagnóstico depois dos 30: um recomeço de entendimento",
      corpo:
        "Publicação demonstrativa. Recebi meu diagnóstico já adulto, depois de anos tentando entender por que certas situações sempre foram tão mais difíceis para mim do que pareciam ser para os outros. Ainda estou processando o que isso significa.",
      status: "publicado",
      createdAt: now,
      updatedAt: now,
      reactions: {},
    },
    {
      id: "seed-post-3",
      authorId: "demo-seed",
      authorDisplayName: DEMO_AUTHOR,
      categoria: "hiperfocos",
      titulo: "Hiperfoco em astronomia salvou meu semestre",
      corpo:
        "Publicação demonstrativa. Nas semanas mais difíceis, voltar para meu hiperfoco em astronomia foi o que me manteve com alguma sensação de estabilidade. Queria muito saber se isso é comum para outras pessoas também.",
      status: "publicado",
      createdAt: now,
      updatedAt: now,
      reactions: {},
    },
    {
      id: "seed-post-4",
      authorId: "demo-seed",
      authorDisplayName: DEMO_AUTHOR,
      categoria: "conquistas",
      titulo: "Consegui pedir uma adaptação e ela foi aceita",
      corpo:
        "Publicação demonstrativa. Depois de meses hesitando, pedi para reduzir o volume dos alarmes não críticos no meu setor. Para minha surpresa, o pedido foi aceito. Pequenas mudanças institucionais fazem diferença.",
      avisoConteudo: undefined,
      status: "publicado",
      createdAt: now,
      updatedAt: now,
      reactions: {},
    },
  ]);
}

seedDemoPosts();

export function listPublishedPosts(): ForumPost[] {
  return postsCollection
    .list()
    .filter((p) => p.status === "publicado")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function listMyPosts(userId: string): ForumPost[] {
  return postsCollection.list().filter((p) => p.authorId === userId);
}

export function getPost(id: string): ForumPost | undefined {
  return postsCollection.get(id);
}

export function createDraftPost(
  data: Pick<ForumPost, "authorId" | "authorDisplayName" | "categoria" | "titulo" | "corpo" | "avisoConteudo">,
): ForumPost {
  const now = new Date().toISOString();
  const post: ForumPost = {
    ...data,
    id: generateId("post"),
    status: "rascunho",
    createdAt: now,
    updatedAt: now,
    reactions: {},
  };
  postsCollection.create(post);
  return post;
}

export function updatePost(id: string, patch: Partial<ForumPost>): void {
  postsCollection.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export function submitPostForReview(id: string): void {
  updatePost(id, { status: "em_revisao" });
}

export function publishPost(id: string): void {
  updatePost(id, { status: "publicado" });
}

export function removePost(id: string): void {
  postsCollection.remove(id);
  commentsCollection.replaceAll(commentsCollection.list().filter((c) => c.postId !== id));
}

export function reactToPost(postId: string, reaction: ReactionType, userId: string): void {
  const post = postsCollection.get(postId);
  if (!post) return;
  const current = post.reactions[reaction] ?? [];
  const already = current.includes(userId);
  const nextList = already ? current.filter((id) => id !== userId) : [...current, userId];
  postsCollection.update(postId, { reactions: { ...post.reactions, [reaction]: nextList } });
}

export function listCommentsForPost(postId: string): ForumComment[] {
  return commentsCollection
    .list()
    .filter((c) => c.postId === postId && c.status === "publicado")
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
}

export function addComment(
  data: Pick<ForumComment, "postId" | "authorId" | "authorDisplayName" | "corpo">,
): ForumComment {
  const comment: ForumComment = {
    ...data,
    id: generateId("comment"),
    status: "publicado",
    createdAt: new Date().toISOString(),
  };
  commentsCollection.create(comment);
  return comment;
}

export function reportContent(data: Pick<Report, "reporterId" | "targetType" | "targetId" | "motivo">): Report {
  const report: Report = {
    ...data,
    id: generateId("report"),
    createdAt: new Date().toISOString(),
    status: "pendente",
  };
  reportsCollection.create(report);
  return report;
}

export function listReports(): Report[] {
  return reportsCollection.list().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function resolveReport(id: string): void {
  reportsCollection.update(id, { status: "resolvida" });
}

export function blockUser(userId: string, blockedUserId: string): void {
  if (blocksCollection.list().some((b) => b.userId === userId && b.blockedUserId === blockedUserId)) return;
  blocksCollection.create({
    id: generateId("block"),
    userId,
    blockedUserId,
    createdAt: new Date().toISOString(),
  });
}

export function unblockUser(userId: string, blockedUserId: string): void {
  const block = blocksCollection
    .list()
    .find((b) => b.userId === userId && b.blockedUserId === blockedUserId);
  if (block) blocksCollection.remove(block.id);
}

export function listBlockedUserIds(userId: string): string[] {
  return blocksCollection
    .list()
    .filter((b) => b.userId === userId)
    .map((b) => b.blockedUserId);
}
