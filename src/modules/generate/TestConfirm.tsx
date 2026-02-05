//    default:
//                             if (part.type === "tool-searchWeb") {
//                               const searchTool = part as any;
//                               // Normalize states for the Confirmation component (AI SDK v6 style)
//                               const stateMap: Record<string, string> = {
//                                 call: "approval-requested",
//                                 result: "approval-responded",
//                               };
//                               const normalizedState =
//                                 stateMap[searchTool.state] || searchTool.state;

//                               console.log("Search tool part:", searchTool);

//                               return (
//                                 <div
//                                   key={`${message.id}-${i}`}
//                                   className="my-2"
//                                 >
//                                   {searchTool.approval && (
//                                     <Confirmation
//                                       approval={searchTool.approval}
//                                       state={normalizedState}
//                                     >
//                                       <ConfirmationRequest>
//                                         <div className="text-sm">
//                                           This tool wants to search for: Design
//                                           context
//                                           {/* <code className="bg-muted px-1 rounded font-mono text-xs">
//                                             {searchTool.args?.query ||
//                                               searchTool.input?.query}
//                                           </code> */}
//                                           <br />
//                                           Do you approve this action?
//                                         </div>
//                                       </ConfirmationRequest>
//                                       <ConfirmationAccepted>
//                                         <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
//                                           <CheckIcon className="size-4" />
//                                           <span>Search approved</span>
//                                         </div>
//                                       </ConfirmationAccepted>
//                                       <ConfirmationRejected>
//                                         <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
//                                           <XIcon className="size-4" />
//                                           <span>Search rejected</span>
//                                         </div>
//                                       </ConfirmationRejected>
//                                       <ConfirmationActions>
//                                         <ConfirmationAction
//                                           variant="outline"
//                                           size="sm"
//                                           onClick={() =>
//                                             handleRejectTool(
//                                               searchTool.approval!.id,
//                                             )
//                                           }
//                                         >
//                                           Reject
//                                         </ConfirmationAction>
//                                         <ConfirmationAction
//                                           variant="default"
//                                           size="sm"
//                                           onClick={() =>
//                                             handleApproveTool(
//                                               searchTool.approval!.id,
//                                             )
//                                           }
//                                         >
//                                           Approve
//                                         </ConfirmationAction>
//                                       </ConfirmationActions>
//                                     </Confirmation>
//                                   )}
//                                   {searchTool.output && (
//                                     <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-dashed truncate max-w-full">
//                                       {typeof searchTool.output === "string"
//                                         ? searchTool.output.substring(0, 100) +
//                                           "..."
//                                         : "Search results received"}
//                                     </div>
//                                   )}
//                                 </div>
//                               );
//                             }
//                             return null;
//                         }