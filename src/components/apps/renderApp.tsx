import type { AppId } from "@/game/types";
import { MailApp } from "./MailApp";
import { MessagesApp } from "./MessagesApp";
import { FilesApp } from "./FilesApp";
import { PhotosApp } from "./PhotosApp";
import { BrowserHistoryApp } from "./BrowserHistoryApp";
import { CallLogsApp } from "./CallLogsApp";
import { EvidenceBoard } from "./EvidenceBoard";
import { CaseFileApp } from "./CaseFileApp";
import { NotesApp } from "./NotesApp";
import { SubmitTheoryApp } from "./SubmitTheoryApp";

/** Single place that maps an app id to its surface. */
export function renderApp(appId: AppId) {
  switch (appId) {
    case "mail":
      return <MailApp />;
    case "messages":
      return <MessagesApp />;
    case "files":
      return <FilesApp />;
    case "photos":
      return <PhotosApp />;
    case "browser":
      return <BrowserHistoryApp />;
    case "calls":
      return <CallLogsApp />;
    case "board":
      return <EvidenceBoard />;
    case "casefile":
      return <CaseFileApp />;
    case "notes":
      return <NotesApp />;
    case "theory":
      return <SubmitTheoryApp />;
  }
}
